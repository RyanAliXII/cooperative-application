import { object, string } from "yup";

export const CreateCooperativeSchema = object({
  name: string().required("Cooperative name is required."),
  registrationNumber: string().required(
    "Cooperative registraion number is required."
  ),
  initials: string().required("Cooperative initials is required."),
  address: string().required("Address is required."),
  province: string().required("Province is required."),
  city: string().required("City is required."),
  account: object().shape({
    givenName: string().required("Given name is required."),
    middleName: string().required("Middlename  is required."),
    surname: string().required("Surname is required."),
    email: string()
      .email("Email is invalid.")
      .required("Account email is required."),
  }),
});
