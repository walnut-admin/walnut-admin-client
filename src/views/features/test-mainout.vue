<script lang="ts" setup>
defineOptions({
  name: 'TestMainout',
})
</script>

<template>
  <div>
    Hooks in `layout/default/index.vue` would not excute anymore, but those in
    `App/src/App.vue` still exists.

    <br>

    Of course that these kind of pages can also achieved with `header`/`tabs`
    etc hidden.

    <br>

    But as I said before the hooks in `layout/default/index.vue` would excute as
    well. You might not want those hooks to excute for this single alone page.

    <br>

    <div class="text-32 line-height-32">
      Main out page demo
    </div>
  </div>
</template>
