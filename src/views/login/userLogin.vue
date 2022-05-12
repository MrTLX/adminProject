<template>
  <div class="login-container">
    <div class="login-weaper bounceInDown">
      <div class="login-border">
        <h1 class="login-title">捷高Hais1000管理系统</h1>
        <div class="login-main">
          <h1>用户登录</h1>
          <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0">
            <el-form-item prop="account">
              <el-input @keyup.enter.native="handleLogin" v-model="loginForm.username" auto-complete="off" placeholder="用户名">
                <i slot="prefix" class="el-icon-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                @keyup.enter.native="handleLogin"
                :type="passwordType"
                v-model="loginForm.password"
                auto-complete="off"
                placeholder="密码"
              >
                <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
                <i slot="prefix" class="el-icon-unlock"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click.native.prevent="handleLogin" class="login-submit">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const crypto = require('crypto')
// import { base62_encode } from '@samwen/base62-util'
const encryptParam = {
  alg: 'des-ede3-cbc',
  autoPad: true,
  key: 'w14OE9H8Q7qV0hisOGl0ZpNX',
  iv: 'CqMfe4eo',
}
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      checked: false,
      code: {
        src: '',
        value: '',
        len: 4,
        type: 'text',
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' },
        ],
      },
      passwordType: 'password',
    }
  },
  methods: {
    ...mapMutations(['setUserName', 'setLoginState']),
    handleLogin() {
      this.$refs.loginForm.validate((validate) => {
        if (validate) {
          // 对密码进行加密
          // let pa = this.encryptEds('message', this.params.password)
          // this.loginForm.password = base62_encode(pa)
          this.$apis.userAPI.login(this.loginForm).then((res) => {
            this.setUserName(res.data)
            this.setLoginState(true)
            this.$router.push({ name: 'views' })
          })
        } else {
          return false
        }
      })
    },
    showPassword() {
      this.passwordType === '' ? (this.passwordType = 'password') : (this.passwordType = '')
    },
    // crypto里面的AES对称加密
    encryptEds(type, text) {
      if (type === 'message') {
        encryptParam.key = '0*CaT!1cJiIIa0oP6RAnTdNH'
      }
      let key = Buffer.from(encryptParam.key)
      let iv = Buffer.from(encryptParam.iv ? encryptParam.iv : 0)
      let plaintext = text
      let alg = encryptParam.alg
      let autoPad = encryptParam.autoPad
      let cipher = crypto.createCipheriv(alg, key, iv)
      cipher.setAutoPadding(autoPad)
      let ciph = cipher.update(plaintext, 'utf8', 'base64')
      ciph += cipher.final('base64')
      return ciph
    },
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position-x: 0;
  background-position-y: center;
  background-image: url('../../assets/images/loginbg.png');
  .login-weaper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-border {
    margin-left: 50%;
    width: 600px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .login-title {
    height: 60px;
    font-size: 25px;
    color: white;
    .en-title {
      font-size: 14px;
    }
  }
  .login-main {
    width: 380px;
    box-sizing: border-box;
    background: white;
    border-radius: 5px;
    box-shadow: 0px 2px 10px rgba(255, 255, 255, 0.4);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    h1 {
      margin: 30px 0 0 0;
      color: #1e9fff;
      font-size: 25px;
      font-weight: bold;
    }
    & > p {
      color: #76838f;
    }
    .wel {
      font-size: 18px;
      color: rgb(121, 121, 121);
      font-weight: bold;
    }
    .login-menu {
      margin-top: 40px;
      width: 100%;
      text-align: center;
      a {
        color: #999;
        font-size: 12px;
        margin: 0px 8px;
      }
    }
    .login-submit {
      width: 100%;
      height: 45px;
      border: 1px solid rgb(30, 159, 255);
      background: rgb(30, 159, 255);
      font-size: 18px;
      letter-spacing: 2px;
      font-weight: 300;
      color: white;
      cursor: pointer;
      font-family: 'neo';
      transition: 0.25s;
    }
    .login-form {
      width: 100%;
      height: 100%;
      padding: 30px 40px;
      i {
        color: #333;
      }
      .el-form-item {
        margin: 0 0 25px 0;
        height: 38px;
        width: 304px;
      }
      .el-form-item:last-child {
        margin-bottom: 0;
      }
      .el-form-item__content {
        position: relative;
        width: 100%;
        height: 100%;
        line-height: normal;
      }
      .el-input {
        input {
          text-indent: 5px;
          background: transparent;
          color: #333;
          height: 38px;
          border: 1px solid rgb(235, 237, 242);
        }
        input::-webkit-input-placeholder {
          color: #d2d2d2;
        }
        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #d2d2d2;
        }
        input:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #d2d2d2;
        }
        input:-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #d2d2d2;
        }
        .el-input__prefix {
          i {
            padding: 0 5px;
            font-size: 16px !important;
            color: #d2d2d2;
          }
        }
      }
    }
    .login-code {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 0 0 0 10px;
    }
    .login-code-img {
      margin-top: 0;
      width: 100px;
      height: 36px;
      background-color: #fdfdfd;
      border: 1px solid #f0f0f0;
      color: #333;
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 5px;
      line-height: 36px;
      text-indent: 5px;
      text-align: center;
    }
  }
}
</style>
