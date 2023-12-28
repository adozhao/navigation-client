import request from '@/utils/request'

export function updateCategoryName(data) {
  return request({
    url: '/category/updateName',
    method: 'post',
    data
  });
}

export function addCategory() {
  return request({
    url: '/category/add',
    method: 'get',
  });
}

export function getCategory() {
  return request({
    url: '/category/list',
    method: 'get'
  });
}

export function delCategory(categoryId) {
  return request({
    url: '/category/delete',
    method: 'get',
    params: {categoryId}
  });
}

export function sortCategory(data) {
  return request({
    url: '/category/sort',
    method: 'post',
    data
  });
}