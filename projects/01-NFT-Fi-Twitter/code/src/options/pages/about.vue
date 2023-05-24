<script setup lang="ts">
interface Props {
  modelValue: string
  foo?: string
}
const {
  modelValue,
  foo = 'default-val',
} = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    options about
  </div>
</template>
