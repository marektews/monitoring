import { ref, onBeforeUnmount } from 'vue'

/**
 * Połączenie WebSocket do powiadamiania o zmianach stanów odprawy autokarów.
 *
 * @param {string[] | (() => string[])} topics  tematy do subskrypcji, np. ['sector:<sid>'],
 *        ['buffer:<name>'] albo getter zwracający aktualną listę tematów. Getter jest przydatny,
 *        gdy lista tematów jest znana dopiero po asynchronicznym pobraniu danych (np. terminali).
 * @param {(state: {rja_id: string, status: string, ts: string}) => void} onState
 *        wołane dla każdej ramki type==='state'
 * @param {() => void} [onReconnect]
 *        wołane po (re)nawiązaniu połączenia — służy do rekoncyliacji (pełny fetch stanów)
 * @returns {{ isConnected: import('vue').Ref<boolean>, resubscribe: () => void, close: () => void }}
 */
export function useOdprawaSocket(topics, onState, onReconnect) {
    const isConnected = ref(false)

    let ws = null
    let closedByUser = false
    let reconnectTimer = null
    let pingTimer = null
    let pongTimer = null
    let attempt = 0

    const backoff = [1000, 2000, 5000, 10000] // ms
    const pongWait = 10000 // ms — brak pong w tym czasie => połączenie uznajemy za martwe

    function currentTopics() {
        return typeof topics === 'function' ? topics() : topics
    }

    function url() {
        const proto = location.protocol === 'https:' ? 'wss' : 'ws'
        return `${proto}://${location.host}/api/ws/odprawa`
    }

    function connect() {
        try {
            ws = new WebSocket(url())
        } catch (e) {
            console.error('WS construct error:', e)
            scheduleReconnect()
            return
        }

        ws.onopen = () => {
            isConnected.value = true
            attempt = 0
            send({ type: 'subscribe', topics: currentTopics() })
            startPing()
            if (onReconnect) onReconnect()
        }

        ws.onmessage = (ev) => {
            let msg
            try {
                msg = JSON.parse(ev.data)
            } catch {
                return
            }
            if (msg.type === 'pong') {
                clearPong()
                return
            }
            if (msg.type === 'state' && onState) {
                onState({ rja_id: msg.rja_id, status: msg.status, ts: msg.ts })
            }
        }

        ws.onclose = () => {
            isConnected.value = false
            stopPing()
            if (!closedByUser) scheduleReconnect()
        }

        ws.onerror = () => {
            // onclose i tak nastąpi — tam jest reconnect
            if (ws) ws.close()
        }
    }

    function send(obj) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(obj))
        }
    }

    // Ponowne wysłanie subskrypcji z aktualną listą tematów (np. po doładowaniu terminali).
    function resubscribe() {
        send({ type: 'subscribe', topics: currentTopics() })
    }

    function startPing() {
        stopPing()
        pingTimer = setInterval(() => {
            send({ type: 'ping' })
            // jeśli serwer nie odpowie pongiem w pongWait, uznajemy połączenie za martwe
            // (np. półotwarty TCP) i zamykamy je — onclose wyzwoli reconnect
            clearPong()
            pongTimer = setTimeout(() => {
                pongTimer = null
                console.warn('WS: brak pong w czasie — zamykam połączenie')
                if (ws) ws.close()
            }, pongWait)
        }, 25000)
    }

    function clearPong() {
        if (pongTimer != null) {
            clearTimeout(pongTimer)
            pongTimer = null
        }
    }

    function stopPing() {
        if (pingTimer != null) {
            clearInterval(pingTimer)
            pingTimer = null
        }
        clearPong()
    }

    function scheduleReconnect() {
        if (closedByUser || reconnectTimer != null) return
        const delay = backoff[Math.min(attempt, backoff.length - 1)]
        attempt++
        reconnectTimer = setTimeout(() => {
            reconnectTimer = null
            connect()
        }, delay)
    }

    function close() {
        closedByUser = true
        stopPing()
        if (reconnectTimer != null) {
            clearTimeout(reconnectTimer)
            reconnectTimer = null
        }
        if (ws) {
            ws.onclose = null
            ws.close()
            ws = null
        }
        isConnected.value = false
    }

    connect()
    onBeforeUnmount(close)

    return { isConnected, resubscribe, close }
}
