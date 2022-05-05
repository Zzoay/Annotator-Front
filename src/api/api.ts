import { request } from './axios'

/**
 * @description -封装User类型的接口方法
 */
export class UserService {       // 模块一
    /**
     * @description 用户登录
     * @param {string} username - 用户名
     * @return {HttpResponse} result
     */
    static async login1(params) {   // 接口一
        return request('/login', params, 'post')
    }
    static async login2(params) {   // 接口二
        return request('/login', params, 'post')
    }
    static async login3(params) {   // 接口三
        return request('/login', params, 'post')
    }
}

export class landRelevant {     // 模块二
    /**
     * @description 获取地列表
     * @return {HttpResponse} result
     */
    static async landList(params) {
        return request('/land_list_info', params, 'get')
    }
}

export function getConv(convId) {
    return request('http://localhost:8000/api/conv_dep/', {'convId': convId}, 'get')
}

export function getConvId() {
    return request('http://localhost:8000/api/conv_dep_ids/', '', 'get')
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