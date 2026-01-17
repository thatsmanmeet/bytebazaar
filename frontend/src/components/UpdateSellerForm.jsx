import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

function UpdateSellerForm({ updateSellerHandler }) {
  const { userInfo } = useSelector((store) => store.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { ...userInfo.sellerInfo },
  });

  const onSubmit = (data) => {
    updateSellerHandler(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 py-4"
    >
      <h2 className="text-xl font-semibold">Seller Updation Form</h2>

      <div>
        <Input
          placeholder="Enter Business Name"
          {...register("businessName", {
            required: "Business name is required",
          })}
        />
        {errors.businessName && (
          <p className="text-red-500 text-sm">{errors.businessName.message}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="What does your business do?"
          {...register("description", {
            required: "This field is required",
          })}
        />
        {errors.businessDescription && (
          <p className="text-red-500 text-sm">
            {errors.businessDescription.message}
          </p>
        )}
      </div>

      <div>
        <Input
          placeholder="Enter Business Email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value:
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="Enter Business Contact Number"
          type="number"
          {...register("phone", {
            required: "Contact number is required",
            minLength: { value: 7, message: "Too short" },
          })}
        />
        {errors.contactNumber && (
          <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
        )}
      </div>

      <div>
        <Input placeholder="Enter Business Website" {...register("website")} />
      </div>

      <div>
        <Input
          placeholder="Where is your business located?"
          {...register("location", { required: "Location is required" })}
        />
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location.message}</p>
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}

export default UpdateSellerForm;
