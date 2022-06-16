import { request } from './axios'


export async function login(data: any) {
    return request('http://localhost:8000/api/user/login', data, 'post')
}

export function logout() {
    return request('http://localhost:8000/api/user/logout', '', 'get')
}

export function getConv(convId) {
    return request('http://localhost:8000/api/conv_dep/', {'convId': convId}, 'get')
}

export function updateConvTagged(convId, tagged) {
    return request('http://localhost:8000/api/conv/' + convId + '/', {'conv_id': convId, 'tagged': tagged}, 'put')
}

export function getConvId() {
    return request('http://localhost:8000/api/conv/', '', 'get')
}

export function getRelation() {
    return request('http://localhost:8000/api/relation/', '', 'get')
}

export function getRelationship(convId) {
    return request('http://localhost:8000/api/relationship/', {'convId': convId}, 'get')
}

export function postRelationship(relationship) {
    return request('http://localhost:8000/api/relationship/', relationship, 'post')
}

export function deleteRelationship(id) {
    return request('http://localhost:8000/api/relationship/' + id, '', 'delete')
}