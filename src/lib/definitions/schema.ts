import { array, number, object, string } from "yup";
import validator from "validator";
export const CreateCooperativeSchema = object({
  name: string().required("Cooperative name is required."),
  registrationNumber: string().required(
    "Cooperative registraion number is required."
  ),
  initials: string().required("Cooperative initials is required."),
  address: string().required("Address is required."),
  account: object().shape({
    givenName: string().required("Given name is required."),
    middleName: string().required("Middlename  is required."),
    surname: string().required("Surname is required."),
    email: string()
      .email("Email is invalid.")
      .required("Account email is required."),
  }),
});

export const EditCooperativeSchema = object({
  id: string().required().uuid(),
  name: string().required("Cooperative name is required."),
  registrationNumber: string().required(
    "Cooperative registraion number is required."
  ),
  initials: string().required("Cooperative initials is required."),
  address: string().required("Address is required."),
  account: object().shape({
    id: string().required().uuid(),
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
  middleName: string().required("Middle name is required."),
  surname: string().required("Surname is required."),
  birthday: string().required("Date of birth is required."),
  gender: string().required("Gender is required."),
  educationalAttainment: string().required(
    "Educational Attainment is required."
  ),
  civilStatus: string().required("Civil status is required."),
  TIN: string().notRequired(),
  spouseName: string().notRequired(),
  presentAddress: string().required("Present address is required."),
  provincialAddress: string().notRequired(),
  officeAddress: string().notRequired(),
  officePhoneNumber: string().notRequired(),
  account: object().shape({
    email: string().email("Email is invalid.").required("Email is required."),
    mobileNumber: string()
      .required("Mobile number is required.")
      .test("is-ph-mobile-number", "Invalid mobile number", (value) =>
        validator.isMobilePhone(value ?? "", "en-PH")
      ),
  }),

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

export const EditMemberValidationSchema = object({
  id: number().integer().min(1),
  givenName: string().required("Given name is required."),
  middleName: string().required("middle name is required."),
  surname: string().required("Surname is required."),
  gender: string().required("Gender is required."),
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
  account: object().shape({
    email: string()
      .email("Email is invalid.")
      .required("Account email is required."),
    mobileNumber: string()
      .required("Mobile number is required.")
      .test("is-ph-mobile-number", "Invalid mobile number", (value) =>
        validator.isMobilePhone(value ?? "", "en-PH")
      ),
  }),
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

export const RegisterMemberAccountSchema = object({
  givenName: string().required("Given name is required."),
  middleName: string().required("Middle name is required."),
  surname: string().required("Surname is required."),
  birthday: string().required("Date is required."),
  email: string().required("Email is required.").email("Invalid email format."),
  password: string().required("Password is required."),
});
