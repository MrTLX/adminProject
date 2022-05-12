/**
 * 系统管理
 */
import http from '../../config/http' // 导入http中创建的axios实例
/* 系统配置 */
const configuration = {
  getProjectInfo() {
    return http.get('getProjectInfo')
  },
  setProjectInfo(params) {
    return http.get('setProjectInfo', {
      params,
    })
  },
  getBasicConfig() {
    return http.get('getBasicConfig')
  },
  updateDate(params) {
    return http.get('updateDate', {
      params,
    })
  },
  SystemTunerPro() {
    return http.get('SystemTunerPro')
  },
  selectSystemConfigInfo(params) {
    return http.get('selectSystemConfigInfo', {
      params,
    })
  },
  addSystemConfig(params) {
    return http.get('/addSystemConfig', {
      params,
    })
  },
  editSystemConfig(params) {
    return http.get('editSystemConfig', {
      params,
    })
  },
  delSystemConfig(params) {
    return http.get('delSystemConfig', {
      params,
    })
  },
  switchSystemConfigInfo(params) {
    return http.get('switchSystemConfigInfo', {
      params,
    })
  },
}
/* 网络配置 */
const networkSet = {}
/* 系统升级 */
const systemUpgrade = {
  upload(params) {
    return http.request({
      url: 'upload/AuthorizationFile',
      method: 'post',
      data: params,
      transformRequest: [
        function (data) {
          return stringify(data)
        },
      ],
    })
  },
  uploadPackage(params) {
    return http.request({
      url: 'agreementUpdate/uploadPackageAgreement',
      method: 'post',
      data: params,
      transformRequest: [
        function (data) {
          return stringify(data)
        },
      ],
    })
  },
}
function stringify(data) {
  const formData = new FormData()
  for (const key in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(key)) {
      if (data[key]) {
        if (data[key].constructor === Array) {
          if (data[key][0]) {
            if (data[key][0].constructor === Object) {
              formData.append(key, JSON.stringify(data[key]))
            } else {
              data[key].forEach((item, index) => {
                formData.append(key + `[${index}]`, item)
              })
            }
          } else {
            formData.append(key + '[]', '')
          }
        } else if (data[key].constructor === Object) {
          if (key == 'file') {
            formData.append(key, data[key].raw)
          } else {
            formData.append(key, JSON.stringify(data[key]))
          }
        } else {
          formData.append(key, data[key])
        }
      } else {
        if (data[key] === 0) {
          formData.append(key, 0)
        } else {
          formData.append(key, '')
        }
      }
    }
  }

  return formData
}
export default { ...configuration, ...systemUpgrade, ...networkSet }
