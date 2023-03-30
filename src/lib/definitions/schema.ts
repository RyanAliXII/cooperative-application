import { array, object, string } from "yup";

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
export const NewMemberValidationSchema = object({
  givenName: string().required("Given name is required."),
  middleName: string().required("middle name is required."),
  surname: string().required("Surname is required."),
  birthday: string().required("Date of birth is required."),
  educationalAttainment: string().required(
    "Educational Attainment is required."
  ),
  civilStatus: string().required("Civil status is required."),
  TIN: string().notRequired(),
  spouseName: string().notRequired(),
  presentAddress: string().required("Present address is required."),
  provincialAddress: string().notRequired(),
  officeAddress: string().notRequired(),
  email: string().email().required("Email is required."),
  mobileNumber: string().required("Mobile number is required."),
  officePhoneNumber: string().notRequired(),
  dependents: array()
    .of(
      object({
        name: string().required("Dependent name is required."),
        relationship: string().required(
          "Relationship of the dependent must be specified."
        ),
        birthday: string().required(
          "Dependent's date of birth must be specified."
        ),
      })
    )
    .min(0),
});
