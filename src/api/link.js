import request from '@/utils/request'

export function delLink(categoryId) {
  return request({
    url: '/link/delete',
    method: 'get',
    params: {
      categoryId
    }
  });
}

export function addLink(data) {
  return request({
    url: '/link/add',
    method: 'post',
    data
  });
}

export function getLinks() {
  return request({
    url: '/link/list',
    method: 'get'
  });
}