<script setup>
import AuthenticationCard from '@/Components/AuthenticationCard.vue'
import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo.vue'
import InputError from '@/Components/InputError.vue'
import InputLabel from '@/Components/InputLabel.vue'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import TextInput from '@/Components/TextInput.vue'
import { Head, useForm } from '@inertiajs/inertia-vue3'
import { ref } from 'vue'

const form = useForm({
  password: '',
})

const passwordInput = ref(null)

const submit = () => {
  form.post(route('password.confirm'), {
    onFinish: () => {
      form.reset()

      passwordInput.value.focus()
    },
  })
}
</script>

<template>
  <Head title="Secure Area" />

  <AuthenticationCard>
    <template #logo>
      <AuthenticationCardLogo />
    </template>

    <div class="mb-4 text-sm text-gray-600">
      {{
        $t(
          'This is a secure area of the application. Please confirm your password before continuing.',
        )
      }}
    </div>

    <form @submit.prevent="submit">
      <div>
        <InputLabel for="password" :value="$t('Password')" />
        <TextInput
          id="password"
          ref="passwordInput"
          v-model="form.password"
          type="password"
          class="mt-1 block w-full"
          required
          autocomplete="current-password"
          autofocus
        />
        <InputError class="mt-2" :message="form.errors.password" />
      </div>

      <div class="flex justify-end mt-4">
        <PrimaryButton
          class="ml-4"
          :class="{ 'opacity-25': form.processing }"
          :disabled="form.processing"
        >
          {{ $t('Confirm') }}
        </PrimaryButton>
      </div>
    </form>
  </AuthenticationCard>
</template>
