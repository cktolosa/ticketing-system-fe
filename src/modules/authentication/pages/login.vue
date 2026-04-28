<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { Kanban } from 'lucide-vue-next';
import { useForm, Field as VeeField } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as z from 'zod';

import { Input } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldGroup, FieldSeparator } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { getErrorMessage } from '@/lib/utils';

import Google from '@/assets/google.svg';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();
const errorMessage = ref('');

const schema = toTypedSchema(
  z.object({
    email: z.string().email().min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
    remember_me: z.boolean().default(false),
  })
);

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
    remember_me: false,
  },
});

const onSubmit = handleSubmit(async (data) => {
  errorMessage.value = '';
  try {
    await auth.login(data.email, data.password, data.remember_me);

    switch (auth.user?.role) {
      case 'superadmin':
        router.push('/su/dashboard');
        break;
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'support':
        router.push('/support/dashboard');
        break;
      case 'customer':
        router.push('/customer/dashboard');
        break;
      default:
        router.push('/');
    }
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'login');
    console.log(error);
    resetForm();
  }
});
</script>
<template>
  <div
    class="from-primary/5 to-card flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-t p-6 md:p-10"
  >
    <div class="flex w-full max-w-md flex-col gap-6">
      <div class="flex items-center gap-2 self-center font-medium">
        <div
          class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
        >
          <Kanban class="size-4" />
        </div>
        adish HAP
      </div>
      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-xl"> Welcome back </CardTitle>
          <CardDescription> Choose how you would like to sign in </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit">
            <FieldGroup>
              <Button variant="outline" type="button">
                <img :src="Google" alt="Google" />
                Login with Google
              </Button>
              <FieldSeparator> or continue with </FieldSeparator>
              <p v-if="errorMessage" class="text-destructive text-sm">
                {{ errorMessage }}
              </p>

              <VeeField v-slot="{ componentField }" name="email">
                <Input
                  v-bind="componentField"
                  label="Email"
                  type="email"
                  placeholder="user@example.com"
                />
              </VeeField>
              <VeeField v-slot="{ componentField }" name="password">
                <Input
                  v-bind="componentField"
                  label="Password"
                  type="password"
                  placeholder="********"
                />
              </VeeField>

              <div class="text-muted-foreground flex flex-wrap justify-between gap-3">
                <VeeField v-slot="{ value, handleChange }" name="remember_me">
                  <div class="flex items-center gap-2">
                    <Checkbox
                      id="remember_me"
                      :checked="value"
                      @update:model-value="handleChange"
                    />
                    <Label for="remember_me" class="font-normal">Keep me signed in</Label>
                  </div>
                </VeeField>
                <a href="#" class="text-sm hover:underline">Forgot your password?</a>
              </div>

              <Button type="submit" :disabled="isSubmitting">
                <Spinner v-if="isSubmitting" />
                Login
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
