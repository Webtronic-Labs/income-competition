<script>
export default {
  name: 'AuthFormInput',
  props: {
    id: String,
    maxlength: Number,
    minlength: Number,
    modelValue: String,
    placeholder: String,
    required: Boolean,
    type: String
  },
  emits: ['update:modelValue']
}
</script>
<template>
  <div class="relative flex flex-col">
    <input
      class="peer bg-transparent h-12 px-3 rounded-md outline-none border-2 border-gray-300 placeholder-transparent"
      :id="id"
      :maxlength="maxlength"
      :minlength="minlength"
      :placeholder="placeholder"
      :required="required"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <label
      :for="id"
      class="bg-rose-600 absolute h-max top-0 bottom-0 left-3 m-auto text-xs -translate-y-6 p-1 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-base peer-focus:-translate-y-6 peer-focus:text-xs"
    >
      {{ placeholder }}
    </label>
  </div>
</template>
