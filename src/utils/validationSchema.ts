// utils/validationSchema.ts
import * as Yup from 'yup';

export const registrationSchema = Yup.object({
  fullName: Yup.string()
    .required('Full name is required'),

  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),

  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit number')
    .required('Mobile number required'),

  address: Yup.string()
    .required('Address is required'),

  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm password is required'),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Password required'),
});

export const dhobiRegistrationSchema = (step: number) => {
  switch (step) {
    case 1:
      return Yup.object().shape({
        businessName: Yup.string().required('Business name is required'),
        ownerName: Yup.string().required('Owner name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        mobile: Yup.string()
          .matches(/^[0-9]{10}$/, 'Mobile must be 10 digits')
          .required('Mobile is required'),
        password: Yup.string()
          .min(6, 'Minimum 6 characters')
          .required('Password is required'),
        address: Yup.string().required('Address is required'),
      });

    case 2:
      return Yup.object().shape({
        serviceArea: Yup.string().required('Service area is required'),
      });

    case 3:
      return Yup.object().shape({
        services: Yup.array()
          .of(
            Yup.object().shape({
              name: Yup.string().required('Service name is required'),
              price: Yup.string()
                .matches(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number')
                .required('Price is required'),
            })
          )
          .min(1, 'At least one service is required'),

        commissionRate: Yup.number()
          .typeError('Commission rate must be a number')
          .required('Commission rate is required')
          .min(1, 'Commission rate must be at least 1%')
          .max(100, 'Commission rate cannot exceed 100%'),
      });

    default:
      return Yup.object();
  }
};


