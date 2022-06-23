import { request } from './axios'


export async function login(data: any) {
    return request('http://localhost:8000/api/user/login', data, 'post')
}

export function logout() {
    return request('http://localhost:8000/api/user/logout', '', 'get')
}

export function getProcess(userId) {
    return request('http://localhost:8000/api/process/', {'userId': userId}, 'get')
}

export function getProcessAssign(processId) {
    return request('http://localhost:8000/api/process_assign/', {'processId': processId}, 'get')
}

export function updateEntryStatus(assignId, status) {
    return request('http://localhost:8000/api/process_assign/' + assignId + '/', {'id': assignId, 'status': status}, 'patch')
}

export function getConv(convId) {
    return request('http://localhost:8000/api/conv_dep/', {'convId': convId}, 'get')
}

export function updateConvStatus(convId, status) {
    return request('http://localhost:8000/api/conv/' + convId + '/', {'conv_id': convId, 'status': status}, 'put')
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