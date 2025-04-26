'use client';

import { createClient } from '@/lib/supabase/client';
import { generateEmail } from '@/lib/openai';
import { extractTextFromPdf } from '@/lib/pdf-parser';
import { useUser } from './useUser';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export type Application = {
  id: string;
  user_id: string;
  resume_url: string | null;
  linkedin_post: string | null;
  generated_email: string | null;
  final_email: string | null;
  created_at: string;
};

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
        return;
      }
      
      setApplications(data as Application[]);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const getApplication = useCallback(async (id: string) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching application:', error);
        toast.error('Failed to load application');
        return null;
      }
      
      return data as Application;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong');
      return null;
    }
  }, [user, supabase]);

  const uploadResume = useCallback(async (file: File) => {
    if (!user) {
      toast.error('You must be logged in');
      return null;
    }
    
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please upload a PDF file');
      return null;
    }
    
    setLoading(true);
    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);
      
      if (uploadError) {
        console.error('Error uploading resume:', uploadError);
        toast.error('Failed to upload resume');
        return null;
      }
      
      const { data } = supabase.storage.from('resumes').getPublicUrl(fileName);
      
      // Create a new application record
      const { data: application, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          resume_url: data.publicUrl,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating application:', error);
        toast.error('Failed to create application');
        return null;
      }
      
      toast.success('Resume uploaded successfully');
      return application as Application;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const saveJobPost = useCallback(async (applicationId: string, jobPost: string) => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }
    
    if (!jobPost.trim()) {
      toast.error('Job post cannot be empty');
      return false;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ linkedin_post: jobPost })
        .eq('id', applicationId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error saving job post:', error);
        toast.error('Failed to save job post');
        return false;
      }
      
      toast.success('Job post saved successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const generateApplicationEmail = useCallback(async (applicationId: string) => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }
    
    setGenerating(true);
    try {
      // Get the application
      const { data: application, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .eq('user_id', user.id)
        .single();
      
      if (fetchError || !application) {
        console.error('Error fetching application:', fetchError);
        toast.error('Failed to load application');
        return false;
      }
      
      // Check if we have a resume URL and job post
      if (!application.resume_url || !application.linkedin_post) {
        toast.error('Resume and job post are required');
        return false;
      }
      
      // Extract text from PDF
      const resumeText = await extractTextFromPdf(application.resume_url);
      
      // Generate email using OpenAI
      const generatedEmail = await generateEmail(resumeText, application.linkedin_post);
      
      // Save the generated email
      const { error: updateError } = await supabase
        .from('applications')
        .update({ 
          generated_email: generatedEmail,
          final_email: generatedEmail // Set final email same as generated initially
        })
        .eq('id', applicationId)
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error saving generated email:', updateError);
        toast.error('Failed to save generated email');
        return false;
      }
      
      toast.success('Email generated successfully');
      router.push(`/preview/${applicationId}`);
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong');
      return false;
    } finally {
      setGenerating(false);
    }
  }, [user, supabase, router]);

  const updateFinalEmail = useCallback(async (applicationId: string, finalEmail: string) => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ final_email: finalEmail })
        .eq('id', applicationId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating final email:', error);
        toast.error('Failed to save email');
        return false;
      }
      
      toast.success('Email saved successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const deleteApplication = useCallback(async (applicationId: string) => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting application:', error);
        toast.error('Failed to delete application');
        return false;
      }
      
      // Update local state
      setApplications(apps => apps.filter(app => app.id !== applicationId));
      
      toast.success('Application deleted successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  return {
    applications,
    loading,
    generating,
    fetchApplications,
    getApplication,
    uploadResume,
    saveJobPost,
    generateApplicationEmail,
    updateFinalEmail,
    deleteApplication,
  };
}
