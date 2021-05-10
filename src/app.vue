<template>
  <div class="view">
    <template v-if="isSplash">
      <div class="splash">
        <div class="logo">
          <img :src="require('./assets/logo.gif').default" />
        </div>
        <div class="menu">
          <div class="corner corner-tl"></div>
          <div class="corner corner-tr"></div>
          <div class="corner corner-bl"></div>
          <div class="corner corner-br"></div>
          <a class="menu-item" @click="onStartGame()">대항해시대2 플레이</a>
          <a class="menu-item" @click="onStartGame('mod_junghwa_v3.0', null, 'CHENGHO.DAT')">정화편(v3.0) 플레이</a>
          <a class="menu-item" @click="onStartGame('mod_ernst_v1.11', 'PLAY.BAT')">에르네스트 모드(v1.11) 플레이</a>
        </div>
        <div class="menu">
          <template v-if="isLoginDbx === null">
            <a class="menu-item menu-item-with-icon">
              <img :src="require('./assets/icon-dropbox.svg').default" />
              <span>인증정보를 가져오는 중</span>
            </a>
          </template>
          <template v-else-if="!isLoginDbx">
            <a class="menu-item menu-item-with-icon" @click="onLoginDropbox">
              <img :src="require('./assets/icon-dropbox.svg').default" />
              <span>로그인</span>
            </a>
          </template>
          <template v-else>
            <a class="menu-item menu-item-with-icon" @click="onLogoutDropbox">
              <img :src="require('./assets/icon-dropbox.svg').default" />
              <span>로그아웃</span>
            </a>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <Game
        :mod="gameMod || undefined"
        :entry="gameEntry || undefined"
        :save="gameSave || undefined"
        :dbx="dbx"
      />
    </template>

    <div class="version">v{{ version }}</div>
    <a class="github" href="https://github.com/wan2land/unchartedwater2" target="_blank">
      <svg version="1.1" width="16" height="16" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
      <span>View on Github</span>
    </a>
  </div>
</template>
<script lang="ts">
import { Dropbox, DropboxAuth } from 'dropbox'
import Vue from 'vue'

import Game from './components/game.vue'
import { parseQueryString } from './utils'

const version = require('../package.json').version // eslint-disable-line @typescript-eslint/no-require-imports

const DBX_CLIENT_ID = '95lb7zut06xyhr8'

export default Vue.extend({
  components: {
    Game,
  },
  data() {
    return {
      isSplash: true,
      gameMod: null as string | null,
      gameEntry: null as string | null,
      gameSave: null as string | null,
      dbx: null as Dropbox | null,
      isLoginDbx: null as boolean | null,
    }
  },
  async mounted() {
    const dbxAccessToken = parseQueryString(location.hash).access_token || window.localStorage.getItem('dbx_access_token') || null as string | null
    history.replaceState({}, '', location.href.replace(location.hash, ''))

    if (dbxAccessToken) {
      const dbx = new Dropbox({ accessToken: dbxAccessToken })
      try {
        await dbx.usersGetCurrentAccount()
        window.localStorage.setItem('dbx_access_token', dbxAccessToken)
        this.dbx = dbx
        this.isLoginDbx = true
      } catch (e) {
        this.onLogoutDropbox()
      }
    } else {
      this.isLoginDbx = false
    }
  },
  computed: {
    version() {
      return version
    },
  },
  methods: {
    onStartGame(gameMod?: string, gameEntry?: string, gameSave?: string) {
      this.gameMod = gameMod ?? null
      this.gameEntry = gameEntry ?? null
      this.gameSave = gameSave ?? null
      this.isSplash = false
    },
    onLoginDropbox() {
      location.href = new DropboxAuth({ clientId: DBX_CLIENT_ID }).getAuthenticationUrl(location.href.replace(/\/+$/, ''))
    },
    onLogoutDropbox() {
      window.localStorage.removeItem('dbx_access_token')
      this.isLoginDbx = false
    },
  },
})
</script>
