<template>
  <div class="chat-container" ref="chatContainer">
    <div class="chat-header">微信聊天</div>
    <div class="chat-messages" ref="chatList">
      <div v-for="message in messages" :key="message.id" class="message" >
        <div class="message-sender">{{ message.sender }}</div>
        <div class="message-content" ref="touchEl" @click.stop.prevent  >{{ message.content }}</div>
      </div>
    </div>
    <div class="chat-input">
      <input v-model="newMessage" placeholder="请输入消息" />
      <button @click="sendMessage">发送</button>
    </div>
    <div
      v-show="isContextMenuVisible"
      class="context-menu"
      
      :style="contextMenuStyle"
    >
      <div class="context-menu-item" vClickOutside="clickoutside"  @click='copyMessage'>复制</div>
      <div class="context-menu-item">转发</div>
      <div class="context-menu-item">删除</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '@/utils/hammer.js'
import { ClickOutside as vClickOutside } from 'element-plus'
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
const messages = ref([
  { id: 1, sender: '张三', content: '你好！' },
  { id: 2, sender: '李四', content: '你好!' },
  { id: 2, sender: '李四', content: '有什么需要帮忙的吗？' },
  { id: 1, sender: '张三', content: '帮我拿一瓶水吧！' },
  { id: 2, sender: '李四', content: '可以，稍等一下。' },
  { id: 2, sender: '李四', content: '给你的水。' },
  { id: 1, sender: '张三', content: '谢谢!' },
])

const newMessage = ref('')
const isContextMenuVisible = ref(false)
const contextMenuStyle = ref({ top: '0px', left: '0px' })
const selectedMessage = ref('')
const chatContainer = ref(null)
const touchEl = ref(null)
const chatList = ref(null)

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    const newId = messages.value.length + 1
    messages.value.push({
      id: newId,
      sender: '我',
      content: newMessage.value
    })
    newMessage.value = ''
  }
}
const showContextMenu = (event, message) => {
  event.preventDefault()
  console.log('message',message)
  selectedMessage.value = message
  const { clientX, clientY } = event.changedPointers[0]
  contextMenuStyle.value = {
    top: `${clientY}px`,
    left: `${clientX + 20}px`
  }
  isContextMenuVisible.value = true
}

 const copyMessage = async() => {
   await toClipboard(selectedMessage.value)
  console.log('消息已复制')
  isContextMenuVisible.value = false
}
const press = () => {
  delete Hammer.defaults.cssProps.userSelect
  touchEl.value.forEach((item) => {
    const hammertime = new Hammer(item)
    hammertime.on('press', function (ev) {
      ev.preventDefault()
      const selection = document.getSelection()
      selection.removeAllRanges()
      let _range = document.createRange()
      _range.selectNode(ev.target)
      selection.addRange(_range)
      console.log('selection.focusNode.data', selection.toString())
      showContextMenu(ev, selection.toString())
    })
  })
}

const debounce = (fn, delay) => {
  let time = null
  return function () {
    if (time !== null) {
      clearTimeout(time)
    }
    time = setTimeout(() => {
      fn.call(this)
    }, delay)
  }
}
const observerAddNode = () => {
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver((mutationsList,observer ) => {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          console.log(mutationsList)
          mutationsList.forEach(item => {
            const nodes = item.addedNodes
            nodes[nodes.length - 1]?.scrollIntoView()
            console.log(nodes[nodes.length - 1])
            chatList.value.classList.add('over-scroll-animation')
            setTimeout(() => {
              chatList.value.classList.remove('over-scroll-animation')
            }, 1000)
            
          })
            // chatList.value.scrollTop =  chatList.value.scrollHeight
        }
    }
  });
  observer.observe(chatList.value, config);
}
const clickoutside = debounce(() => {
  console.log('v-click-outside="clickoutside"')
  isContextMenuVisible.value = false
}, 0)

onMounted(() => {
  press()
  observerAddNode()
})
</script>
<style lang="scss">
.over-scroll-animation{
    animation: overScroll 0.3s forwards ease-in-out;
} 

@keyframes overScroll{
    0%{
        transform: translateY(0vh);
    }
    20%{
        transform: translateY(-0.5vh);
    }
    35%{
        transform: translateY(-1vh);
    }
    50%{
        transform: translateY(-0.6vh);
    }
    80%{
        transform: translateY(-0.2vh);
    }
    100%{
        transform: translateY(0vh);
    }
}


.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f3f3;
  padding: 20px;
}

.chat-header {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  
}

.message-sender {
  font-weight: bold;
  margin-bottom: 5px;
}

.message-content {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 8px;
}

.chat-input {
  display: flex;
  align-items: center;
  margin-top: 20px;

  input {
    flex: 1;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #cccccc;
    margin-right: 10px;
  }

  button {
    background-color: #007bff;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
}
.context-menu {
  display: flex;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 8px;
  min-width: 100px;
  z-index: 100;
}

.context-menu-item {
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    background-color: #f3f3f3;
  }
}
</style>
