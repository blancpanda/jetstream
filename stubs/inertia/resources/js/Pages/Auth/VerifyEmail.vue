<script setup>
import AuthenticationCard from '@/Components/AuthenticationCard.vue'
import AuthenticationCardLogo from '@/Components/AuthenticationCardLogo.vue'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import { Head, Link, useForm } from '@inertiajs/inertia-vue3'
import { computed } from 'vue'

const props = defineProps({
  status: String,
})

const form = useForm()

const submit = () => {
  form.post(route('verification.send'))
}

const verificationLinkSent = computed(
  () => props.status === 'verification-link-sent',
)
</script>

<template>
  <Head title="Email Verification" />

  <AuthenticationCard>
    <template #logo>
      <AuthenticationCardLogo />
    </template>

    <div class="mb-4 text-sm text-gray-600">
      {{
        $t(
          "Before continuing, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.",
        )
      }}
    </div>

    <div
      v-if="verificationLinkSent"
      class="mb-4 font-medium text-sm text-green-600"
    >
      {{
        $t(
          'A new verification link has been sent to the email address you provided during registration.',
        )
      }}
    </div>

    <form @submit.prevent="submit">
      <div class="mt-4 flex items-center justify-between">
        <PrimaryButton
          :class="{ 'opacity-25': form.processing }"
          :disabled="form.processing"
        >
          {{ $t('Resend Verification Email') }}
        </PrimaryButton>

        <div>
          <Link
            :href="route('profile.show')"
            class="underline text-sm text-gray-600 hover:text-gray-900"
          >
            {{ $t('Edit Profile') }}
          </Link>

          <Link
            :href="route('logout')"
            method="post"
            as="button"
            class="underline text-sm text-gray-600 hover:text-gray-900 ml-2"
          >
            {{ $t('Log Out') }}
          </Link>
        </div>
      </div>
    </form>
  </AuthenticationCard>
</template>
