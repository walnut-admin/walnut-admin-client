import { createGlobalState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useConversationStore } from './useConversationStore'

export const useConversationHistory = createGlobalState(() => {
  const { conversationList: conversations, switchConversation, updateConversationTitle } = useConversationStore()

  const searchKeyword = ref('')
  const filteredConversations = computed(() =>
    conversations.value.filter(c =>
      c.title.toLowerCase().includes(searchKeyword.value.toLowerCase()),
    ),
  )

  const hoveredConvId = ref('')
  const historyPopoverVisible = ref(false)

  const editingConvId = ref('')
  const editingTitle = ref('')

  /** Enter edit mode for a conversation title */
  function startEditTitle(conv: { id: string, title: string }) {
    editingConvId.value = conv.id
    editingTitle.value = conv.title
  }

  /** Save the edited title and exit edit mode */
  function saveTitle() {
    if (editingTitle.value.trim()) {
      updateConversationTitle(editingConvId.value, editingTitle.value.trim())
    }
    editingConvId.value = ''
    editingTitle.value = ''
  }

  /** Cancel title editing without saving */
  function cancelEdit() {
    editingConvId.value = ''
    editingTitle.value = ''
  }

  /** Close the conversation history popover */
  function closeHistoryPopover() {
    historyPopoverVisible.value = false
  }

  /** Switch to a different conversation and close the history popover */
  function handleSwitchConversation(id: string) {
    switchConversation(id)
    historyPopoverVisible.value = false
  }

  return {
    searchKeyword,
    filteredConversations,
    hoveredConvId,
    historyPopoverVisible,
    editingConvId,
    editingTitle,
    startEditTitle,
    saveTitle,
    cancelEdit,
    closeHistoryPopover,
    handleSwitchConversation,
  }
})
