
<script lang="ts">

import { defineComponent, reactive } from "vue";
import Cookies from 'js-cookie'
import { login } from "../api/api";
import { SET_USER, CLEAR_USER } from "../store";
import { User } from "../types/common";

import Nav from './Nav.vue'

export default defineComponent({
  name: "Login",
  components: { Nav },
  setup() {
    const validatePassword = (rule: any, value: string, callback: Function) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    const state = reactive({
      loginForm: {
        account: "",
        password: "",
      },

      loginRules: {
        account: [{ required: true, trigger: "blur" }],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
      },
      forgetRules: {
        account: [{ required: true, trigger: "blur" }],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
    });

    return {
      state,
      validatePassword,
    };
  },
  mounted() {
    if (this.state.loginForm.account === "") {
      // @ts-ignore
      this.$refs.account.focus();
    } else if (this.state.loginForm.password === "") {
      // @ts-ignore
      this.$refs.password.focus();
    }
  },
  computed: {
    // rules() {
    //   return this.state.isFP ? this.state.forgetRules : this.state.loginRules;
    // },
  },
  methods: {
    checkCapslock(e: KeyboardEvent) {
      let { key } = e;
      // @ts-ignore
      this.state.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z"
    },
    handleLogin() {
    //   this.state.isFP = false;
      // @ts-ignore
      this.$refs.loginForm.validate(async (valid: Boolean) => {
        if (valid) {
          this.state.loading = true;
          const req = {
            username: this.state.loginForm.account,
            password: this.state.loginForm.password,
          };

          try {
            const data  = await login(req)
            const user: User = {
              // @ts-ignore
              id: data.id, username: data.username, email: data.email, nickname: data.nickname,
            };
            // @ts-ignore
            this.$store.commit(SET_USER, {
              user,
            });
            
            window.sessionStorage.userInfo = JSON.stringify(user);
           
            await this.$router.push({
              path: "/home",
            });
            this.state.loading = false;
          } catch (e) {
            this.state.loading = false;
          }
        }
      })
    },
  },
})
</script>

<template>
<Nav page-now="/login"></Nav>

<div class="main-panel">

<div class="row align-items-center">
    <div class="col">
        <div class="cover">
            <img src="/grass.png" alt="Card image cap" width="300" height="500">
        </div>
    </div>

    <div class="col">
        <div class="login-container">
        <el-form
        ref="loginForm"
        :model="state.loginForm"
        autocomplete="on"
        class="login-form"
        label-position="left"
        @keyup.enter="handleLogin"
        >
        <div class="title-container">
            <h4 class="title">登录</h4>
        </div>

        <el-form-item prop="account">
            <el-input
            ref="account"
            v-model="state.loginForm.account"
            autocomplete="on"
            name="account"
            placeholder="用户名"
            tabindex="1"
            type="text"
            />
        </el-form-item>

        <!-- <el-tooltip
            v-model="state.capsTooltip"
            content="大写锁定已打开"
            manual
            placement="right"
        > -->
            <el-form-item prop="password">
            <el-input
                :key="state.passwordType"
                ref="password"
                v-model="state.loginForm.password"
                :type="state.passwordType"
                autocomplete="on"
                name="password"
                placeholder="密码"
                tabindex="2"
                @keyup="checkCapslock"
            />
            </el-form-item>
        <!-- </el-tooltip> -->

        <el-button
            :loading="state.loading"
            style="width: 100%; margin-bottom: 30px"
            type="primary"
            @click="handleLogin"
        >
            登录
        </el-button>
        </el-form>
        </div>
    </div>
    
</div>

</div>
</template>


<style lang="css" scoped>
.main-panel {
    height: 100vh;
    width: 100%;
    overflow: hidden;
}

.row {
    height: 100% !important;
    width: 100% !important; 
}

.col {
    /* height: 100%; */
    margin: 0 0 20vh 0;
    width: 100%;
    display:flex;
    align-items: center;
    justify-content: center;
}
.cover {
    float: left;
}

.login-container {
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
}

.login-form {
  min-height: 280px;
  min-width: 200px;
  height: 32vh;
  width: 22vw;
  max-width: 100%;
  overflow: hidden;
  margin: 0 20vw 0 0;
  padding: 50px;
  border: 1px solid rgb(60, 70, 136);
  border-radius: 4px;
}

/* .tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;
}

.tips span:first-of-type {
  margin-right: 16px;
} */

.svg-container {
  padding: 6px 5px 6px 15px;
  color: #889aa4;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}

.title-container {
  position: relative;
  color: #333;
}

.title-container .title {
  /* font-size: 40px; */
  margin: 0px auto 25px 10px;
  /* text-align: center; */
  font-weight: bold;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}

.thirdparty-button {
  position: absolute;
  right: 0;
  bottom: 6px;
}

.fp {
  font-size: 12px;
  text-align: right;
  margin-bottom: 10px;
  cursor: pointer;
}

</style>