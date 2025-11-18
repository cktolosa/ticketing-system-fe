<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/vue-form";
import * as z from "zod";

const schema = z.object({
    email: z.email().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

const defaultValues: z.infer<typeof schema> = {
    email: "",
    password: "",
};

const form = useForm({
    defaultValues,
    validators: {
        onChange: schema,
    },
    onSubmit: ({ value }) => {
        alert(JSON.stringify(value));
    },
});

function isInvalid(field: any) {
    return field.state.meta.isTouched && !field.state.meta.isValid;
}
</script>

<template>
    <main>
        <form @submit.prevent.stop="form.handleSubmit">
            <FieldSet>
                <FieldGroup>
                    <form.Field v-slot="{ field }" name="email">
                        <Field :aria-invalid="isInvalid(field)">
                            <FieldLabel :for="field.name">Email</FieldLabel>
                            <Input
                                type="email"
                                :id="field.name"
                                :name="field.name"
                                placeholder="juandelacruz@gmail.com"
                                :model-value="field.state.value"
                                @blur="field.handleBlur"
                                @change="
                                    field.handleChange($event.target.value)
                                "
                                :aria-invalid="isInvalid(field)"
                            />
                            <FieldError :errors="field.state.meta.errors" />
                        </Field>
                    </form.Field>
                    <form.Field v-slot="{ field }" name="password">
                        <Field :aria-invalid="isInvalid(field)">
                            <FieldLabel :for="field.name">Password</FieldLabel>
                            <Input
                                type="password"
                                :id="field.name"
                                :name="field.name"
                                placeholder="********"
                                :model-value="field.state.value"
                                @blur="field.handleBlur"
                                @change="
                                    field.handleChange($event.target.value)
                                "
                                :aria-invalid="isInvalid(field)"
                            />
                            <FieldError :errors="field.state.meta.errors" />
                        </Field>
                    </form.Field>
                    <Field orientation="horizontal">
                        <Button> Login </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    </main>
</template>
