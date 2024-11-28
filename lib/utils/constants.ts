import { FormField } from "../types/form";

export const mockJson: FormField[] = [
    {
      checked: true,
      description: "This is your public display Name",
      disabled: false,
      label: "User Name",
      placeholder: "shadcn",
      required: true,
      rowIndex: 0,
      type: "text",
      value: "",
      varient: "Input"
    },
    {
      label: "Age",
      name: "age",
      placeholder: "Enter Your Age",
      required: true,
      rowIndex: 1,
      type: "number",
      value: "",
      varient: "Input"
    },
    {
      label: "Preferred Contact Method",
      name: "contactMethod",
      placeholder: "Select contact method",
      required: true,
      rowIndex: 2,
      type: "select",
      varient: "Select",
      options: [
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" }
      ],
      dependsOn: {
        field: "age",
        condition: "greaterThan",
        value: 18
      }
    },
    {
      label: "Agree to terms",
      name: "terms_001",
      required: true,
      rowIndex: 3,
      type: "checkBox",
      varient: "CheckBox"
    }
  ];