<script setup>
import ActionMessage from '@/Components/ActionMessage.vue'
import FormSection from '@/Components/FormSection.vue'
import InputError from '@/Components/InputError.vue'
import InputLabel from '@/Components/InputLabel.vue'
import PrimaryButton from '@/Components/PrimaryButton.vue'
import SecondaryButton from '@/Components/SecondaryButton.vue'
import TextInput from '@/Components/TextInput.vue'
import { Inertia } from '@inertiajs/inertia'
import { Link, useForm } from '@inertiajs/inertia-vue3'
import { ref } from 'vue'

const props = defineProps({
  user: Object,
})

const form = useForm({
  _method: 'PUT',
  name: props.user.name,
  email: props.user.email,
  photo: null,
})

const verificationLinkSent = ref(null)
const photoPreview = ref(null)
const photoInput = ref(null)

const updateProfileInformation = () => {
  if (photoInput.value) {
    form.photo = photoInput.value.files[0]
  }

  form.post(route('user-profile-information.update'), {
    errorBag: 'updateProfileInformation',
    preserveScroll: true,
    onSuccess: () => clearPhotoFileInput(),
  })
}

const sendEmailVerification = () => {
  verificationLinkSent.value = true
}

const selectNewPhoto = () => {
  photoInput.value.click()
}

const updatePhotoPreview = () => {
  const photo = photoInput.value.files[0]

  if (!photo) return

  const reader = new FileReader()

  reader.onload = (e) => {
    photoPreview.value = e.target.result
  }

  reader.readAsDataURL(photo)
}

const deletePhoto = () => {
  Inertia.delete(route('current-user-photo.destroy'), {
    preserveScroll: true,
    onSuccess: () => {
      photoPreview.value = null
      clearPhotoFileInput()
    },
  })
}

const clearPhotoFileInput = () => {
  if (photoInput.value?.value) {
    photoInput.value.value = null
  }
}
</script>

<template>
  <FormSection @submitted="updateProfileInformation">
    <template #title>
      {{ $t('Profile Information') }}
    </template>

    <template #description>
      {{ $t("Update your account's profile information and email address.") }}
    </template>

    <template #form>
      <!-- Profile Photo -->
      <div
        v-if="$page.props.jetstream.managesProfilePhotos"
        class="col-span-6 sm:col-span-4"
      >
        <!-- Profile Photo File Input -->
        <input
          ref="photoInput"
          type="file"
          class="hidden"
          @change="updatePhotoPreview"
        />

        <InputLabel for="photo" :value="$t('Photo')" />

        <!-- Current Profile Photo -->
        <div v-show="!photoPreview" class="mt-2">
          <img
            :src="user.profile_photo_url"
            :alt="user.name"
            class="rounded-full h-20 w-20 object-cover"
          />
        </div>

        <!-- New Profile Photo Preview -->
        <div v-show="photoPreview" class="mt-2">
          <span
            class="block rounded-full w-20 h-20 bg-cover bg-no-repeat bg-center"
            :style="'background-image: url(\'' + photoPreview + '\');'"
          />
        </div>

        <SecondaryButton
          class="mt-2 mr-2"
          type="button"
          @click.prevent="selectNewPhoto"
        >
          {{ $t('Select A New Photo') }}
        </SecondaryButton>

        <SecondaryButton
          v-if="user.profile_photo_path"
          type="button"
          class="mt-2"
          @click.prevent="deletePhoto"
        >
          {{ $t('Remove Photo') }}
        </SecondaryButton>

        <InputError :message="form.errors.photo" class="mt-2" />
      </div>

      <!-- Name -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="name" :value="$t('Name')" />
        <TextInput
          id="name"
          v-model="form.name"
          type="text"
          class="mt-1 block w-full"
          autocomplete="name"
        />
        <InputError :message="form.errors.name" class="mt-2" />
      </div>

      <!-- Email -->
      <div class="col-span-6 sm:col-span-4">
        <InputLabel for="email" :value="$t('Email')" />
        <TextInput
          id="email"
          v-model="form.email"
          type="email"
          class="mt-1 block w-full"
        />
        <InputError :message="form.errors.email" class="mt-2" />

        <div
          v-if="
            $page.props.jetstream.hasEmailVerification &&
            user.email_verified_at === null
          "
        >
          <p class="text-sm mt-2">
            Your email address is unverified.

            <Link
              :href="route('verification.send')"
              method="post"
              as="button"
              class="underline text-gray-600 hover:text-gray-900"
              @click.prevent="sendEmailVerification"
            >
              Click here to re-send the verification email.
            </Link>
          </p>

          <div
            v-show="verificationLinkSent"
            class="mt-2 font-medium text-sm text-green-600"
          >
            A new verification link has been sent to your email address.
          </div>
        </div>
      </div>
    </template>

    <template #actions>
      <ActionMessage :on="form.recentlySuccessful" class="mr-3">
        {{ $t('Saved.') }}
      </ActionMessage>

      <PrimaryButton
        :class="{ 'opacity-25': form.processing }"
        :disabled="form.processing"
      >
        {{ $t('Save') }}
      </PrimaryButton>
    </template>
  </FormSection>
</template>
