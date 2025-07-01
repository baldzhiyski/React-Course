import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSignUp } from "./useSignUp";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { signUp, isLoading } = useSignUp();
  const onSubmit = ({ fullName, email, password }) => {
    signUp(
      { fullName, email, password },
      {
        onSettled: () => {
          reset();
        },
      }
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow id="fullName" label="Full name" error={errors.fullName?.message}>
        <Input
          id="fullName"
          disabled={isLoading}
          {...register("fullName", { required: "Full name is required" })}
        />
      </FormRow>

      <FormRow id="email" label="Email address" error={errors.email?.message}>
        <Input
          disabled={isLoading}
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please enter a valid email",
            },
          })}
        />
      </FormRow>

      <FormRow
        id="password"
        label="Password (min 8 characters)"
        error={errors.password?.message}
      >
        <Input
          disabled={isLoading}
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        id="passwordConfirm"
        label="Repeat password"
        error={errors.passwordConfirm?.message}
      >
        <Input
          disabled={isLoading}
          id="passwordConfirm"
          type="password"
          {...register("passwordConfirm", {
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues().password || "Passwords do not match",
          })}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button type="submit">Create new user</Button>
      </FormRow>
    </Form>
  );
}
