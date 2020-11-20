<template>
  <div class="game">
    <div class="tools">
      <div class="top">
        <a class="tool-item tool-fullscreen icon" @click="toggleFullScreen" title="전체화면">
          <template v-if="!enabledToggleFullscreen">
            <svg version="1.1" viewBox="0 0 128 128">
              <path d="M52.585,65.916c-0.556,-0.555 -1.195,-0.833 -1.917,-0.833c-0.722,0 -1.362,0.277 -1.917,0.833l-27.667,27.667l-12,-12.002c-1.055,-1.053 -2.304,-1.582 -3.75,-1.582c-1.445,0 -2.695,0.529 -3.751,1.582c-1.055,1.057 -1.583,2.308 -1.583,3.752l0,37.334c0,1.445 0.528,2.694 1.583,3.75c1.057,1.055 2.307,1.583 3.751,1.583l37.334,0c1.445,0 2.694,-0.528 3.75,-1.583c1.055,-1.056 1.583,-2.305 1.583,-3.75c0,-1.444 -0.528,-2.695 -1.583,-3.752l-12,-11.997l27.667,-27.669c0.555,-0.555 0.833,-1.193 0.833,-1.916c0,-0.723 -0.278,-1.36 -0.833,-1.918l-9.5,-9.499Z" style="fill-rule:nonzero;"/>
              <path d="M126.418,1.583c-1.055,-1.056 -2.305,-1.583 -3.75,-1.583l-37.334,0c-1.444,0 -2.693,0.527 -3.75,1.583c-1.054,1.055 -1.582,2.305 -1.582,3.75c0,1.445 0.528,2.695 1.582,3.75l11.999,12l-27.667,27.667c-0.555,0.556 -0.833,1.194 -0.833,1.917c0,0.722 0.278,1.361 0.833,1.916l9.502,9.501c0.555,0.555 1.192,0.832 1.915,0.832c0.723,0 1.361,-0.277 1.916,-0.832l27.669,-27.667l11.997,11.999c1.057,1.055 2.308,1.584 3.752,1.584c1.445,0 2.694,-0.529 3.75,-1.584c1.055,-1.055 1.582,-2.305 1.582,-3.75l0,-37.334c0.001,-1.446 -0.523,-2.693 -1.581,-3.749Z" style="fill-rule:nonzero;"/>
            </svg>
          </template>
          <template v-else>
            <svg version="1.1" viewBox="0 0 128 128">
              <path d="M128,12.463c0,-0.735 -0.284,-1.384 -0.848,-1.95l-9.665,-9.664c-0.565,-0.565 -1.213,-0.848 -1.949,-0.848c-0.735,0 -1.383,0.283 -1.948,0.848l-28.146,28.143l-12.204,-12.206c-1.073,-1.074 -2.347,-1.611 -3.816,-1.611c-1.468,0 -2.74,0.537 -3.814,1.611c-1.073,1.074 -1.61,2.345 -1.61,3.814l0,37.976c0,1.47 0.537,2.741 1.61,3.815c1.074,1.074 2.345,1.611 3.814,1.611l37.975,0c1.47,0 2.744,-0.537 3.817,-1.611c1.072,-1.074 1.611,-2.345 1.611,-3.815c0,-1.469 -0.538,-2.741 -1.611,-3.814l-12.207,-12.207l28.144,-28.143c0.563,-0.564 0.847,-1.214 0.847,-1.949Z" style="fill-rule:nonzero;"/>
              <path d="M58.574,64.003l-37.975,0c-1.469,0 -2.741,0.537 -3.815,1.611c-1.073,1.072 -1.611,2.345 -1.611,3.814c0,1.469 0.538,2.741 1.611,3.814l12.207,12.207l-28.143,28.142c-0.566,0.565 -0.848,1.216 -0.848,1.949c0,0.736 0.282,1.386 0.848,1.951l9.662,9.663c0.566,0.564 1.216,0.845 1.95,0.845c0.735,0 1.385,-0.28 1.95,-0.845l28.143,-28.144l12.206,12.206c1.073,1.073 2.345,1.611 3.814,1.611c1.47,0 2.742,-0.538 3.815,-1.611c1.074,-1.072 1.611,-2.345 1.611,-3.815l0,-37.975c0,-1.469 -0.537,-2.741 -1.61,-3.812c-1.073,-1.074 -2.345,-1.611 -3.815,-1.611Z" style="fill-rule:nonzero;"/>
            </svg>
          </template>
        </a>
        <a class="tool-item tool-save icon" @click="downloadSaveFile" title="세이브 파일 저장하기">
          <svg version="1.1" viewBox="0 0 128 128">
            <path d="M126.333,35.332c-1.111,-2.665 -2.445,-4.777 -4.001,-6.332l-23.333,-23.334c-1.555,-1.554 -3.666,-2.888 -6.333,-4c-2.665,-1.111 -5.11,-1.666 -7.332,-1.666l-77.334,0c-2.221,0 -4.111,0.777 -5.666,2.333c-1.556,1.555 -2.333,3.444 -2.333,5.667l0,112c0,2.224 0.777,4.113 2.333,5.668c1.555,1.554 3.445,2.332 5.666,2.332l112.001,0c2.223,0 4.112,-0.778 5.667,-2.332c1.554,-1.555 2.331,-3.444 2.331,-5.668l0,-77.333c0,-2.223 -0.555,-4.667 -1.666,-7.335Zm-72.999,-22c0,-0.722 0.264,-1.346 0.792,-1.874c0.528,-0.527 1.153,-0.791 1.875,-0.791l16.001,0c0.72,0 1.345,0.263 1.873,0.791c0.529,0.528 0.793,1.152 0.793,1.874l0,26.667c0,0.724 -0.266,1.348 -0.793,1.876c-0.528,0.526 -1.153,0.791 -1.873,0.791l-16.001,0c-0.722,0 -1.348,-0.264 -1.875,-0.791c-0.528,-0.529 -0.792,-1.152 -0.792,-1.876l0,-26.667Zm42.668,104.002l-64.002,0l0,-32.001l64.002,0l0,32.001Zm21.334,0l-10.67,0l0,-34.668c0,-2.223 -0.778,-4.111 -2.333,-5.667c-1.555,-1.555 -3.444,-2.333 -5.665,-2.333l-69.334,0c-2.223,0 -4.112,0.778 -5.668,2.333c-1.555,1.555 -2.333,3.444 -2.333,5.667l0,34.668l-10.666,0l0,-106.668l10.666,0l0,34.667c0,2.223 0.777,4.111 2.333,5.667c1.556,1.555 3.445,2.333 5.667,2.333l48.002,0c2.221,0 4.112,-0.778 5.666,-2.333c1.554,-1.555 2.333,-3.444 2.333,-5.667l0,-34.667c0.833,0 1.915,0.277 3.25,0.833c1.335,0.555 2.279,1.11 2.834,1.666l23.418,23.417c0.556,0.556 1.111,1.515 1.666,2.876c0.558,1.361 0.834,2.431 0.834,3.209l0,74.667Z" />
          </svg>
        </a>
        <a class="tool-item tool-load icon" @click="uploadSaveFile" title="세이브 파일 불러오기">
          <svg version="1.1" viewBox="0 0 128 128">
            <path d="M126.994,66.077c-0.982,-2.056 -2.482,-3.632 -4.491,-4.726c-2.012,-1.095 -4.224,-1.642 -6.638,-1.642l-12.874,0l0,-10.729c0,-4.112 -1.476,-7.644 -4.426,-10.594c-2.951,-2.951 -6.482,-4.425 -10.594,-4.425l-36.476,0l0,-2.146c0,-4.112 -1.475,-7.644 -4.425,-10.593c-2.95,-2.951 -6.482,-4.426 -10.594,-4.426l-21.457,0c-4.112,0 -7.644,1.475 -10.594,4.426c-2.95,2.949 -4.425,6.481 -4.425,10.593l0,64.37c0,4.112 1.475,7.643 4.425,10.593c2.95,2.951 6.482,4.426 10.594,4.426l72.954,0c2.993,0 6.122,-0.771 9.387,-2.314c3.263,-1.541 5.854,-3.498 7.776,-5.867l19.781,-24.339c2.056,-2.592 3.083,-5.273 3.083,-8.046c0.001,-1.61 -0.334,-3.128 -1.006,-4.561Zm-118.411,-34.261c0,-1.787 0.625,-3.307 1.877,-4.559c1.251,-1.251 2.771,-1.877 4.56,-1.877l21.457,0c1.788,0 3.307,0.625 4.559,1.877c1.251,1.252 1.877,2.772 1.877,4.559l0,4.292c0,1.788 0.627,3.308 1.878,4.559c1.251,1.251 2.771,1.878 4.559,1.878l38.621,0c1.788,0 3.309,0.626 4.561,1.877c1.25,1.251 1.876,2.771 1.876,4.559l0,10.729l-51.495,0c-3.039,0 -6.169,0.771 -9.388,2.313c-3.218,1.542 -5.811,3.498 -7.778,5.868l-17.164,21.12l0,-57.195Zm109.628,41.438l-19.713,24.339c-1.116,1.386 -2.704,2.57 -4.761,3.552c-2.056,0.984 -3.978,1.476 -5.766,1.476l-72.952,0c-2.369,0 -3.553,-0.783 -3.553,-2.347c0,-0.715 0.402,-1.609 1.207,-2.683l19.713,-24.339c1.162,-1.386 2.759,-2.559 4.794,-3.52c2.033,-0.961 3.944,-1.442 5.733,-1.442l72.952,0c2.369,0 3.553,0.783 3.553,2.347c0,0.762 -0.401,1.633 -1.207,2.617Z" />
          </svg>
        </a>
      </div>
      <div class="bottom">
        <a
          class="tool-item tool-keyboard icon"
          :class="{ disabled: !enabledToggleKeyboard }"
          @click="toggleKeyboard"
        >
          <svg version="1.1" viewBox="0 0 128 128">
            <path d="M125.5,28.1c-1.667,-1.667 -3.679,-2.501 -6.034,-2.501l-110.933,0c-2.355,0 -4.366,0.834 -6.033,2.501c-1.666,1.667 -2.5,3.678 -2.5,6.033l0,59.733c0,2.356 0.834,4.366 2.5,6.033c1.667,1.667 3.678,2.502 6.033,2.502l110.933,0c2.355,0 4.367,-0.835 6.034,-2.502c1.666,-1.667 2.5,-3.677 2.5,-6.033l0,-59.733c0,-2.355 -0.834,-4.366 -2.5,-6.033Zm-6.034,65.766l-110.933,0l0,-59.733l110.933,0l0,59.733Z" />
            <path d="M18.133,85.332l6.4,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.71 -0.355,-1.067 -1.067,-1.067l-6.4,0c-0.711,0 -1.067,0.357 -1.067,1.067l0,6.399c0,0.711 0.356,1.067 1.067,1.067Z" />
            <path d="M18.133,68.267l14.933,0c0.711,0 1.068,-0.357 1.068,-1.068l0,-6.4c0,-0.711 -0.357,-1.066 -1.068,-1.066l-14.933,0c-0.711,0 -1.067,0.355 -1.067,1.066l0,6.4c0,0.711 0.356,1.068 1.067,1.068Z" />
            <path d="M18.133,51.199l6.4,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.711 -0.355,-1.066 -1.067,-1.067l-6.4,0c-0.711,0 -1.067,0.356 -1.067,1.067l0,6.399c0,0.711 0.356,1.067 1.067,1.067Z" />
            <path d="M92.801,76.799l-57.6,0c-0.712,0 -1.067,0.357 -1.067,1.068l0,6.399c0,0.709 0.355,1.067 1.067,1.067l57.597,0c0.712,0 1.068,-0.356 1.068,-1.067l0,-6.399c0,-0.711 -0.356,-1.068 -1.065,-1.068Z" />
            <path d="M42.667,67.199c0,0.711 0.355,1.068 1.066,1.068l6.4,0c0.711,0 1.066,-0.357 1.066,-1.068l0,-6.4c0,-0.711 -0.354,-1.066 -1.066,-1.066l-6.4,0c-0.711,0 -1.066,0.355 -1.066,1.066l0,6.4Z" />
            <path d="M35.201,51.199l6.399,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.711 -0.356,-1.066 -1.067,-1.067l-6.399,0c-0.712,0 -1.067,0.356 -1.067,1.067l0,6.399c0,0.711 0.356,1.067 1.067,1.067Z" />
            <path d="M59.733,67.199c0,0.711 0.356,1.068 1.066,1.068l6.4,0c0.711,0 1.068,-0.357 1.068,-1.068l0,-6.4c0,-0.711 -0.357,-1.066 -1.068,-1.066l-6.4,0c-0.71,0 -1.066,0.355 -1.066,1.066l0,6.4Z" />
            <path d="M52.266,51.199l6.4,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.711 -0.355,-1.066 -1.067,-1.067l-6.4,0c-0.711,0 -1.067,0.356 -1.067,1.067l0,6.399c0,0.711 0.356,1.067 1.067,1.067Z" />
            <path d="M76.8,67.199c0,0.711 0.356,1.068 1.065,1.068l6.401,0c0.711,0 1.066,-0.357 1.066,-1.068l0,-6.4c0,-0.711 -0.355,-1.066 -1.066,-1.066l-6.401,0c-0.709,0 -1.065,0.355 -1.065,1.066l0,6.4Z" />
            <path d="M109.866,76.799l-6.399,0c-0.712,0 -1.068,0.357 -1.068,1.068l0,6.399c0,0.709 0.356,1.067 1.068,1.067l6.399,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.711 -0.355,-1.068 -1.067,-1.068Z" />
            <path d="M69.333,51.199l6.401,0c0.711,0 1.066,-0.356 1.066,-1.067l0,-6.399c0,-0.711 -0.355,-1.066 -1.066,-1.067l-6.401,0c-0.711,0 -1.066,0.356 -1.066,1.067l0,6.399c0,0.711 0.355,1.067 1.066,1.067Z" />
            <path d="M86.4,51.199l6.399,0c0.711,0 1.067,-0.356 1.067,-1.067l0,-6.399c0,-0.711 -0.356,-1.066 -1.067,-1.067l-6.399,0c-0.711,0 -1.068,0.356 -1.068,1.067l0,6.399c0,0.711 0.357,1.067 1.068,1.067Z" />
            <path d="M93.866,67.199c0,0.711 0.355,1.068 1.066,1.068l14.933,0c0.712,0 1.068,-0.357 1.068,-1.068l0,-23.466c0,-0.711 -0.355,-1.066 -1.068,-1.067l-6.399,0c-0.711,0 -1.067,0.356 -1.067,1.067l0,16l-7.467,0c-0.711,0 -1.066,0.355 -1.066,1.066l0,6.4l0,0Z" />
          </svg>
        </a>
      </div>
      <!-- 
      <a class="tool-item tool-mute-off icon">
        <svg version="1.1" viewBox="0 0 128 128">
          <path d="M64,88.613c6.77,0 12.563,-2.41 17.384,-7.228c4.819,-4.819 7.229,-10.616 7.229,-17.385l0,-39.384c0,-6.77 -2.408,-12.564 -7.229,-17.385c-4.821,-4.819 -10.614,-7.231 -17.384,-7.231c-6.77,0 -12.564,2.412 -17.385,7.231c-4.821,4.82 -7.231,10.615 -7.231,17.385l0,39.384c0,6.769 2.411,12.566 7.231,17.385c4.82,4.818 10.615,7.228 17.385,7.228Z" />
          <path d="M106.844,50.692c-0.971,-0.974 -2.128,-1.462 -3.461,-1.462c-1.332,0 -2.486,0.488 -3.461,1.462c-0.974,0.975 -1.461,2.128 -1.461,3.461l0,9.847c0,9.487 -3.373,17.602 -10.116,24.346c-6.742,6.743 -14.858,10.115 -24.346,10.115c-9.487,0 -17.602,-3.372 -24.346,-10.115c-6.743,-6.742 -10.115,-14.858 -10.115,-24.346l0,-9.847c0,-1.333 -0.487,-2.486 -1.461,-3.461c-0.975,-0.974 -2.127,-1.462 -3.461,-1.462c-1.335,0 -2.489,0.488 -3.463,1.462c-0.974,0.975 -1.462,2.128 -1.462,3.461l0,9.847c0,11.333 3.783,21.193 11.347,29.576c7.563,8.384 16.909,13.192 28.038,14.422l0,10.154l-19.692,0c-1.333,0 -2.487,0.488 -3.461,1.463c-0.975,0.974 -1.462,2.128 -1.462,3.461c0,1.331 0.487,2.488 1.462,3.462c0.974,0.973 2.128,1.462 3.461,1.462l49.229,0c1.333,0 2.489,-0.488 3.462,-1.462c0.975,-0.974 1.463,-2.13 1.463,-3.462c0,-1.333 -0.488,-2.487 -1.463,-3.461c-0.973,-0.975 -2.128,-1.463 -3.462,-1.463l-19.689,0l0,-10.154c11.127,-1.23 20.472,-6.038 28.036,-14.422c7.565,-8.383 11.349,-18.243 11.349,-29.576l0,-9.847c0,-1.332 -0.489,-2.485 -1.465,-3.461Z" />
        </svg>
      </a>
      <a class="tool-item tool-mute-on icon">
        <svg version="1.1" viewBox="0 0 128 128">
          <path d="M30.693,72.691c-0.769,-3.077 -1.154,-5.974 -1.154,-8.692l0,-9.847c0,-1.333 -0.487,-2.487 -1.461,-3.461c-0.975,-0.975 -2.128,-1.462 -3.461,-1.462c-1.335,0 -2.489,0.488 -3.463,1.462c-0.974,0.974 -1.462,2.128 -1.462,3.461l0,9.846c0,5.693 1.078,11.18 3.231,16.464l7.77,-7.771Z" />
          <path d="M64,88.612c6.769,0 12.565,-2.41 17.383,-7.229c4.82,-4.818 7.231,-10.615 7.231,-17.384l0,-9.847l27.769,-27.768c0.512,-0.513 0.768,-1.103 0.768,-1.769c0,-0.667 -0.256,-1.257 -0.768,-1.769l-6.307,-6.308c-0.514,-0.514 -1.104,-0.77 -1.77,-0.77c-0.666,0 -1.256,0.256 -1.768,0.77l-94.921,94.921c-0.513,0.513 -0.769,1.103 -0.769,1.768c0,0.668 0.256,1.258 0.769,1.77l6.307,6.308c0.513,0.513 1.103,0.768 1.769,0.768c0.667,0 1.257,-0.255 1.77,-0.768l19.538,-19.538c5.64,3.488 11.666,5.565 18.076,6.231l0,10.154l-19.692,0c-1.333,0 -2.488,0.488 -3.461,1.463c-0.975,0.973 -1.463,2.128 -1.463,3.461c0,1.331 0.488,2.488 1.463,3.461c0.973,0.974 2.128,1.463 3.461,1.463l49.229,0c1.333,0 2.487,-0.489 3.461,-1.463c0.975,-0.973 1.462,-2.129 1.462,-3.461c0,-1.333 -0.487,-2.488 -1.462,-3.461c-0.974,-0.975 -2.128,-1.463 -3.461,-1.463l-19.692,0l0,-10.154c11.128,-1.23 20.473,-6.038 28.038,-14.421c7.563,-8.384 11.346,-18.243 11.346,-29.576l0,-9.849c0,-1.333 -0.488,-2.486 -1.461,-3.461c-0.976,-0.974 -2.129,-1.461 -3.462,-1.461c-1.333,0 -2.487,0.487 -3.462,1.461c-0.974,0.975 -1.461,2.128 -1.461,3.461l0,9.847c0,9.487 -3.373,17.602 -10.115,24.344c-6.743,6.743 -14.859,10.115 -24.346,10.115c-5.538,0 -10.794,-1.306 -15.769,-3.923l7.385,-7.382c2.771,0.974 5.565,1.459 8.385,1.459Z" />
          <path d="M78.192,4.539c-4.231,-3.025 -8.962,-4.539 -14.192,-4.539c-6.769,0 -12.565,2.412 -17.384,7.231c-4.82,4.82 -7.23,10.615 -7.23,17.385l0,39.383l47.767,-47.768c-1.744,-4.769 -4.73,-8.666 -8.961,-11.692Z" />
        </svg>
      </a> -->
    </div>
    <div
      class="screen"
      :style="{
        '--screen-width': `${width}px`,
        '--screen-height': `${height}px`,
      }"
      ref="screen"
    >
      <div class="canvas-container">
        <canvas ref="canvas"></canvas>
      </div>
      <!-- <div class="dosbox-container">
        <div class="canvas"></div>
      </div> -->
      <div class="event-blocker joystick" ref="mobileController"></div>
      <div class="keyboard" v-if="enabledToggleKeyboard">
        <div class="col">
          <div class="line">
            <Key label="/" sublabel="Q" description="Menu 4"
                 @gamepad-keydown="keydown('KeyQ')"
                 @gamepad-keyup="keyup('KeyQ')"
            />
            <Key label="*" sublabel="W" description="Menu 3"
                 @gamepad-keydown="keydown('KeyW')"
                 @gamepad-keyup="keyup('KeyW')"
            />
            <Key label="-" sublabel="E" description="Menu 2"
                 @gamepad-keydown="keydown('KeyE')"
                 @gamepad-keyup="keyup('KeyE')"
            />
          </div>
          <div class="line">
            <Key label="7"
                 @gamepad-keydown="keydown('Digit7')"
                 @gamepad-keyup="keyup('Digit7')"
            />
            <Key label="8"
                 @gamepad-keydown="keydown('Digit8')"
                 @gamepad-keyup="keyup('Digit8')"
            />
            <Key label="9"
                 @gamepad-keydown="keydown('Digit9')"
                 @gamepad-keyup="keyup('Digit9')"
            />
          </div>
          <div class="line">
            <Key label="4"
                 @gamepad-keydown="keydown('Digit4')"
                 @gamepad-keyup="keyup('Digit4')"
            />
            <Key label="5"
                 @gamepad-keydown="keydown('Digit5')"
                 @gamepad-keyup="keyup('Digit5')"
            />
            <Key label="6"
                 @gamepad-keydown="keydown('Digit6')"
                 @gamepad-keyup="keyup('Digit6')"
            />
          </div>
          <div class="line">
            <Key label="1"
                 @gamepad-keydown="keydown('Digit1')"
                 @gamepad-keyup="keyup('Digit1')"
            />
            <Key label="2"
                 @gamepad-keydown="keydown('Digit2')"
                 @gamepad-keyup="keyup('Digit2')"
            />
            <Key label="3"
                 @gamepad-keydown="keydown('Digit3')"
                 @gamepad-keyup="keyup('Digit3')"
            />
          </div>
          <div class="line">
            <Key label="0"
                 @gamepad-keydown="keydown('Digit0')"
                 @gamepad-keyup="keyup('Digit0')"
            />
            <Key label="Page<br />Up"
                 @gamepad-keydown="keydown('PageUp')"
                 @gamepad-keyup="keyup('PageUp')"
            />
            <Key label="Page<br />Down"
                 @gamepad-keydown="keydown('PageDown')"
                 @gamepad-keyup="keyup('PageDown')"
            />
          </div>
        </div>
        <div class="col">
          <div class="line">
            <Key label="+" sublabel="R" description="Menu 1"
                 @gamepad-keydown="keydown('KeyR')"
                 @gamepad-keyup="keyup('KeyR')"
            />
          </div>
          <div class="line">
            <Key label="="
                 @gamepad-keydown="keydown('NumpadEqual')"
                 @gamepad-keyup="keyup('NumpadEqual')"
            />
          </div>
          <div class="line">
            <Key label="ESC"
                 @gamepad-keydown="keydown('Escape')"
                 @gamepad-keyup="keyup('Escape')"
            />
          </div>
          <div class="line">
            <Key class="key-row-2" label="Enter"
                 @gamepad-keydown="keydown('Enter')"
                 @gamepad-keyup="keyup('Enter')"
            />
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div class="message" v-if="message" v-html="message" />
    </transition>

  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { create } from 'nipplejs'
import fileDialog from 'file-dialog'

import Key from '../components/key.vue'
import { createDos } from '../dos/create-dos'
import { detectFileChange } from '../fs/detect-file-change'
import { createIdbFileSystem, IdbFileSystem } from '../fs/create-idb-file-system'
import { blockAddEventListener, restoreAddEventListener, getBlockedHandler, createKeyboardEvent, EventHandler } from '../event'


const KEY_MAPS: Record<string, number> = {
  // Original Keypad
  Digit0: 48,
  Digit1: 49,
  Digit2: 50,
  Digit3: 51,
  Digit4: 52,
  Digit5: 53,
  Digit6: 54,
  Digit7: 55,
  Digit8: 56,
  Digit9: 57,

  Numpad0: 96,
  Numpad1: 97,
  Numpad2: 98,
  Numpad3: 99,
  Numpad4: 100,
  Numpad5: 101,
  Numpad6: 102,
  Numpad7: 103,
  Numpad8: 104,
  Numpad9: 105,

  NumpadAdd: 107,
  NumpadSubtract: 109,
  NumpadMultiply: 106,
  NumpadDivide: 111,
  NumpadEqual: 187,
  NumpadEnter: 13,

  NumpadDecimal: 110, // .

  PageUp: 33,
  PageDown: 34,

  Enter: 13, // Enter
  Space: 32, // Space

  ArrowLeft: 100,
  ArrowUp: 104,
  ArrowRight: 102,
  ArrowDown: 98,

  Escape: 27, // Escape

  // Extend
  KeyR: 107, // +
  KeyE: 109, // -
  KeyW: 106, // *
  KeyQ: 111, // /

  // Special
  ArrowLeftDown: 97,
  ArrowRightDown: 99,
  ArrowLeftUp: 103,
  ArrowRightUp: 105,
}

const JOYSTICK_MAPS: Record<string, string> = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
}

export default Vue.extend({
  components: {
    Key,
  },
  props: {
    mod: {
      type: String,
    },
    entry: {
      type: String,
      default: 'KOEI.COM',
    },
    save: {
      type: String,
      default: 'KOUKAI2.DAT',
    },
  },
  data() {
    return {
      $database: null as IdbFileSystem | null, 
      width: 640,
      height: 480,
      enabledToggleFullscreen: false,
      enabledToggleKeyboard: true,
      isClearExit: false,
      messageSt: null as any,
      message: null as string | null,
      keydownHandlers: [] as EventHandler[],
      keyupHandlers: [] as EventHandler[],
    }
  },
  async mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()

    const canvas = this.$refs.canvas as HTMLCanvasElement
    const controller = this.$refs.mobileController as HTMLElement

    const joystick = create({
      zone: controller,
    })

    blockAddEventListener(document, ['keydown', 'keyup', 'keypress'])

    const db = this.$database = this.mod
      ? await createIdbFileSystem(this.mod, 1)
      : await createIdbFileSystem('water2', 1)
    const { fs, main } = await createDos(canvas)

    if (this.mod) {
      await fs.extract(`/static/${this.mod}.zip`)
    } else {
      await fs.extract('/static/water2.zip')
    }
    
    const saveFileBody = await db.load<Uint8Array>(this.save)
    if (saveFileBody) {
      // Overwrite Save File
      ;(fs as any).fs.writeFile(this.save, saveFileBody)
    }

    const ci = await main(['-c', this.entry])

    this.keydownHandlers = getBlockedHandler(document, 'keydown')
    this.keyupHandlers = getBlockedHandler(document, 'keyup')

    restoreAddEventListener(document)

    document.addEventListener('keydown', this.onKeydown)
    document.addEventListener('keyup', this.onKeyup)

    let currentJoystickCode: string | null = null
    let isRunningJoystick = false
    const triggerEventStream = (code: string) => {
      this.keydown(code)
      setTimeout(() => {
        this.keyup(code)
        setTimeout(() => {
          if (isRunningJoystick && currentJoystickCode) {
            triggerEventStream(currentJoystickCode)
          }
        }, 60)
      }, 100)
    }
    joystick.on('move', (e, data) => {
      if (data.force > 0.3) {
        if (data.angle.degree >= 22.5 && data.angle.degree < 67.5) {
          currentJoystickCode = 'ArrowRightUp'
        } else if (data.angle.degree >= 67.5 && data.angle.degree < 112.5) {
          currentJoystickCode = 'ArrowUp'
        } else if (data.angle.degree >= 112.5 && data.angle.degree < 157.5) {
          currentJoystickCode = 'ArrowLeftUp'
        } else if (data.angle.degree >= 157.5 && data.angle.degree < 202.5) {
          currentJoystickCode = 'ArrowLeft'
        } else if (data.angle.degree >= 202.5 && data.angle.degree < 247.5) {
          currentJoystickCode = 'ArrowLeftDown'
        } else if (data.angle.degree >= 247.5 && data.angle.degree < 292.5) {
          currentJoystickCode = 'ArrowDown'
        } else if (data.angle.degree >= 292.5 && data.angle.degree < 337.5) {
          currentJoystickCode = 'ArrowRightDown'
        } else {
          currentJoystickCode = 'ArrowRight'
        }
        if (isRunningJoystick) {
          return
        }
        isRunningJoystick = true
        triggerEventStream(currentJoystickCode)
      }
    })
    joystick.on('end', (e, data) => {
      isRunningJoystick = false
      currentJoystickCode = null
    })

    let messageSt: any = null
    detectFileChange(fs, this.save, async () => {
      db.save(this.save, (fs as any).fs.readFile(this.save))
      this.toastMessage('세이브 파일이 브라우저에 저장되었습니다.', 1000)
      this.isClearExit = true
      setTimeout(() => {
        this.isClearExit = false
      }, 5000)
    })
    window.addEventListener('beforeunload', this.onBeforeUnload)
    document.addEventListener('fullscreenchange', this.onFullScreenChange)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
    document.removeEventListener('keyup', this.onKeyup)
    document.removeEventListener('fullscreenchange', this.onFullScreenChange)
    window.removeEventListener('beforeunload', this.onBeforeUnload)
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      const { width: screenWidth, height: screenHeight } = (this.$refs.screen as HTMLElement).getBoundingClientRect()
      console.log(screenWidth / 640, screenHeight/ 480)
      if (screenWidth / 640 > screenHeight / 480) {
        this.width = ~~(screenHeight * 640 / 480)
        this.height = screenHeight
      } else {
        this.width = screenWidth
        this.height = ~~(screenWidth * 480 / 640)
      }
    },
    onFullScreenChange() {
      this.enabledToggleFullscreen = !!window.document.fullscreenElement
    },
    onBeforeUnload(e: BeforeUnloadEvent) {
      if (this.isClearExit) {
        return
      }
      e.preventDefault()
      return e.returnValue = '페이지를 벗어나면 저장하지 않은 내용이 날아갈 수 있습니다.'
    },
    onKeydown(e: KeyboardEvent) {
      this.keydown(e.code)
    },
    onKeyup(e: KeyboardEvent) {
      this.keyup(e.code)
    },
    toastMessage(message: string, timeout = 3000) {
      this.message = message
      if (this.messageSt) {
        clearTimeout(this.messageSt)
      }
      this.messageSt = setTimeout(() => {
        this.message = null
        this.messageSt = null
      }, timeout)
    },
    toggleFullScreen() {
      const doc = window.document
      if (!doc.fullscreenElement) {
        doc.documentElement.requestFullscreen()
      } else {
        doc.exitFullscreen()
      }
    },
    async downloadSaveFile() {
      if (!this.$database) {
        return
      }
      const data = await this.$database.load<Uint8Array>(this.save)
      if (!data) {
        console.log('!')
        return
      }
      const url = URL.createObjectURL(new Blob([data], {
        type: 'application/octet-stream',
      }))
      const a = document.createElement('a')
      a.href = url
      a.download = this.save
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      this.$nextTick(() => a.remove())
    },
    async uploadSaveFile() {
      if (!this.$database) {
        return
      }
      const db = this.$database
      const files = await fileDialog()
      if (!files[0]) {
        return
      }
      const data = new Uint8Array(await files[0].arrayBuffer())
      db.save(this.save, data)
      this.toastMessage('세이브 파일이 브라우저에 저장되었습니다.<br />새로고침 후 파일을 불러 올 수 있습니다.')
    },
    toggleKeyboard() {
      this.enabledToggleKeyboard = !this.enabledToggleKeyboard
    },
    keypress(code: string) {
      this.keydown(code)
      setTimeout(() => this.keyup(code), 120)
    },
    keydown(code: string) {
      if (KEY_MAPS[code]) {
        const event = createKeyboardEvent('keydown', KEY_MAPS[code])
        this.keydownHandlers.forEach(handler => handler(event))
      }
    },
    keyup(code: string) {
      if (KEY_MAPS[code]) {
        const event = createKeyboardEvent('keyup', KEY_MAPS[code])
        this.keyupHandlers.forEach(handler => handler(event))
      }
    },
  },
})
</script>
