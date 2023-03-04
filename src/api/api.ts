import { request } from './axios'


export async function login(data: any) {
    return request('/api/user/login', data, 'post')
}

export function logout() {
    return request('/api/user/logout', '', 'get')
}

export function getProcess(userId) {
    return request('/api/process/', {'userId': userId}, 'get')
}

export function getProcessAssign(processId) {
    return request('/api/process_assign/', {'processId': processId}, 'get')
}

export function updateEntryStatus(assignId, status) {
    return request('/api/process_assign/' + assignId + '/', {'id': assignId, 'status': status}, 'patch')
}

export function getConv(convId) {
    return request('/api/conv_dep/', {'convId': convId}, 'get')
}

export function updateConvStatus(convId, status) {
    return request('/api/conv/' + convId + '/', {'conv_id': convId, 'status': status}, 'put')
}

export function getConvId() {
    return request('/api/conv/', '', 'get')
}

export function getRelation() {
    return request('/api/relation/', '', 'get')
}

export function getRelationship(convId) {
    return request('/api/relationship/', {'convId': convId}, 'get')
}

export function postRelationship(relationship) {
    return request('/api/relationship/', relationship, 'post')
}

export function deleteRelationship(id) {
    return request('/api/relationship/' + id, '', 'delete')
}