<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/vue-form";

const form = useForm({
    defaultValues: {
        email: "",
        password: "",
    },
    onSubmit: ({ value }) => {
        alert(JSON.stringify(value));
    },
});
</script>

<template>
    <main>
        <form @submit.prevent.stop="form.handleSubmit">
            <FieldSet>
                <FieldGroup>
                    <form.Field name="email">
                        <template v-slot="{ field }">
                            <Field>
                                <FieldLabel :for="field.name">Email</FieldLabel>
                                <Input
                                    :id="field.name"
                                    type="email"
                                    :name="field.name"
                                    :value="field.state.value"
                                    @input="
                                        (e: Event) =>
                                            field.handleChange(
                                                (e.target as HTMLInputElement)
                                                    .value,
                                            )
                                    "
                                    @blur="field.handleBlur"
                                    placeholder="juandelacruz@gmail.com"
                                />
                            </Field>
                        </template>
                    </form.Field>
                    <form.Field name="password">
                        <template v-slot="{ field }">
                            <Field>
                                <FieldLabel :for="field.name">
                                    Password
                                </FieldLabel>
                                <Input
                                    :id="field.name"
                                    type="password"
                                    :name="field.name"
                                    :value="field.state.value"
                                    @input="
                                        (e: Event) =>
                                            field.handleChange(
                                                (e.target as HTMLInputElement)
                                                    .value,
                                            )
                                    "
                                    @blur="field.handleBlur"
                                    placeholder="********"
                                />
                            </Field>
                        </template>
                    </form.Field>
                    <Field orientation="horizontal">
                        <Button> Login </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    </main>
</template>
