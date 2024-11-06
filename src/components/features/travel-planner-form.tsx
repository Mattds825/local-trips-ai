"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { date, z } from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { formSchema } from "../../pages/api/schemas";
import { generateTripPlan } from "../../pages/api/ai";

// define common interests that can be used to suggest a local trip destination
const interests = [
  {
    value: "outdoors",
    label: "outdoors",
  },
  {
    value: "culture",
    label: "culture",
  },
  {
    value: "food",
    label: "food",
  },
  {
    value: "history",
    label: "history",
  },
  {
    value: "adventure",
    label: "adventure",
  },
  {
    value: "relaxation",
    label: "relaxation",
  },
];

// define the form component
const TravelPlannerForm = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/generate-trip-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Failed to generate trip plan");
      }
      const data = await response.json();
      console.log("Trip plan generated:");
      console.log(data);
    } catch (error) {
      console.error("Error generating trip plan:", error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-4">
          {/* startDate form field */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        form.setValue(
                          "endDate",
                          addDays(date ?? new Date(), 1)
                        );
                      }}
                      disabled={
                        (date) => date < new Date() // set to future dates
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>The day you start your trip</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* endDate form field */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        form.getValues("startDate")
                          ? addDays(form.getValues("startDate"), 1)
                          : field.value
                      }
                      onSelect={field.onChange}
                      disabled={
                        (date) =>
                          date < new Date() ||
                          date < addDays(form.getValues("startDate"), 1) // set to dates after the day after the start date
                      }
                      initialFocus
                      defaultMonth={form.getValues("endDate")}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>This day you end your trip.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* budget form field */}
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Budget</FormLabel>
              <Input
                {...field}
                type="number"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              <FormDescription>How much you plan to spend?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* interest selection form field */}
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Interests</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      Selected Interests
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search activity..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No activity found.</CommandEmpty>
                      <CommandGroup>
                        {interests.map((interest) => (
                          <CommandItem
                            value={interest.label}
                            key={interest.value}
                            onSelect={() => {
                              if (selectedInterests.includes(interest.label)) {
                                setSelectedInterests(
                                  selectedInterests.filter(
                                    (item) => item !== interest.label
                                  )
                                );
                                form.setValue(
                                  "interests",
                                  selectedInterests.filter(
                                    (item) => item !== interest.label
                                  )
                                );
                              } else {
                                setSelectedInterests([
                                  ...selectedInterests,
                                  interest.label,
                                ]);
                                form.setValue("interests", [
                                  ...selectedInterests,
                                  interest.label,
                                ]);
                              }
                            }}
                          >
                            {interest.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedInterests.includes(interest.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Let us know what you like to do during your trip.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* location form field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Location</FormLabel>
              <Input {...field} placeholder="enter you location" />
              <FormDescription>Where are you located</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default TravelPlannerForm;
