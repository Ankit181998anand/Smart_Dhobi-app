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
    .min(5, 'Minimum 5 characters')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm password is required'),
  
  coordinates: Yup.array()
    .of(Yup.number())
    .length(2, 'Invalid coordinates'),
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
          .min(5, 'Minimum 5 characters')
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
      });
    
    case 4:
      return Yup.object().shape({
        accountHolderName: Yup.string().required('Account holder name is required'),
        bankName: Yup.string().required('Bank name is required'),
        accountNumber: Yup.string()
          .matches(/^\d+$/, 'Account number must be digits only')
          .min(9, 'Must be at least 9 digits')
          .max(18, 'Cannot exceed 18 digits')
          .required('Account number is required'),
        confirmAccountNumber: Yup.string()
          .oneOf([Yup.ref('accountNumber'), ''], 'Account numbers must match')
          .required('Confirm account number is required'),
        ifscCode: Yup.string()
          .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid 11-character IFSC code (e.g., SBIN0001234)')
          .required('IFSC code is required'),
        branchName: Yup.string().required('Branch name is required'),
        accountType: Yup.string().oneOf(['savings', 'current']).required('Account type is required'),
      });

    default:
      return Yup.object();
  }
};


