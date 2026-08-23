"use client";

import { useEffect, useState } from "react";
import {
  getJob,
  updateJob,
} from "@/services/job.service";

import { useRouter } from "next/navigation";


interface EditJobFormProps {
  id: string;
}


interface Job {
  id: string;
  title: string;
  description: string;
  location?: string;
  salary?: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[];
}


export default function EditJobForm({
  id,
}: EditJobFormProps) {

  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);


  useEffect(() => {

    const loadJob = async () => {

      try {

        const response = await getJob(id);

        setJob(response.data);

      } catch(error) {

        console.error(error);

      }

    };


    if(id){
      loadJob();
    }


  }, [id]);




  const handleSubmit = async(
    e: React.FormEvent
  ) => {

    e.preventDefault();


    if(!job) return;


    try {

      await updateJob(
        id,
        {
          title: job.title,
          description: job.description,
          location: job.location,
          salary: job.salary,
          employmentType: job.employmentType,
          experienceLevel: job.experienceLevel,
          skills: job.skills,
        }
      );


      alert("Job updated successfully");


      router.push(
        "/dashboard/recruiter/jobs"
      );


    } catch(error){

      console.error(error);

      alert("Update failed");

    }

  };




  if(!job){

    return (
      <div className="p-6">
        Loading...
      </div>
    );

  }




  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >


      <input
        className="border p-2 w-full"
        value={job.title}
        onChange={(e)=>
          setJob({
            ...job,
            title:e.target.value
          })
        }
      />



      <textarea
        className="border p-2 w-full"
        value={job.description}
        onChange={(e)=>
          setJob({
            ...job,
            description:e.target.value
          })
        }
      />



      <input
        className="border p-2 w-full"
        value={job.location || ""}
        onChange={(e)=>
          setJob({
            ...job,
            location:e.target.value
          })
        }
      />



      <input
        className="border p-2 w-full"
        value={job.salary || ""}
        onChange={(e)=>
          setJob({
            ...job,
            salary:e.target.value
          })
        }
      />



      <input
        className="border p-2 w-full"
        value={job.employmentType}
        onChange={(e)=>
          setJob({
            ...job,
            employmentType:e.target.value
          })
        }
      />



      <input
        className="border p-2 w-full"
        value={job.experienceLevel}
        onChange={(e)=>
          setJob({
            ...job,
            experienceLevel:e.target.value
          })
        }
      />



      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Job
      </button>


    </form>

  );

}