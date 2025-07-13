// 🔧 Sanitize les données reçues pour chaque entité avant de les passer au repository

export function sanitizePagePayload(body) {
    return {
        title: body.title ?? '',
        url: body.url ?? '',
        content: body.content ?? '',
        visible: body.visible ? 1 : 0,
        menuId: body.menu_id !== null ? Number(body.menu_id) : null
    }
}

export function sanitizeUserPayload(body) {
    return {
        firstname: body.firstname ?? '',
        lastname: body.lastname ?? '',
        email: body.email ?? '',
        role: ['admin', 'user'].includes(body.role) ? body.role : 'user',
        active: body.active ? 1 : 0
    }
}

export function sanitizeMenuPayload(body) {
    return {
        title: body.title ?? '',
    }
}

export function sanitizeEmotionPayload(body) {
    return {
        label: body.label ?? '',
        category: body.category ?? '',
        emoji: body.emoji ?? '',
    }
}
  