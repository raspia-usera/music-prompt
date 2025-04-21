
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://boktwgksctowdzwjhcgy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJva3R3Z2tzY3Rvd2R6d2poY2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzMwMTEsImV4cCI6MjA2MDg0OTAxMX0.PaHwx49rPR0z0D-W4_zO0sT6nMIDiMYfC3D03rCMpIw';

export const supabase = createClient(supabaseUrl, supabaseKey);
