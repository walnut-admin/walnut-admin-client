export const useSharedDocumentVisibility = createSharedComposable(() => {
  const documentVisibility = useDocumentVisibility()
  return computed(() => documentVisibility.value === 'visible')
})
