import axiosClient from "./axiosClient";

const productApi = {
  async getAll(params) {
    var qs = require('qs');
    const response = await axiosClient.get('user', {
      params: {
        ...params,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      },
    })
    return response
  },

  get(id) {
    const url = `/user/${id}/`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = `/user/`;
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/user/${data.id}/`;
    return axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/user/${id}/`;
    return axiosClient.delete(url);
  },

}

export default productApi