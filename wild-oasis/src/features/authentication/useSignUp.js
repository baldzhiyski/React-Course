import { useMutation } from "@tanstack/react-query";
import { signUp as signUpAPI } from "../../services/apiAuth";
import { toast } from "react-hot-toast";

export function useSignUp() {
  const { mutate: signUp, isLoading } = useMutation({
    mutationFn: ({ fullName, email, password }) =>
      signUpAPI({ fullName, email, password }),
    onSuccess: (user) => {
      console.log(user);
      toast.success(
        "Account successfully created ! Please verify the new account form the user's email adress."
      );
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong ....");
    },
  });

  return { signUp, isLoading };
}
