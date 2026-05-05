import { createClient } from '@supabase/supabase-js'

export  const supabase = createClient(
  "https://mmwwqufyttcrjyyxyebh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1td3dxdWZ5dHRjcmp5eXh5ZWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1Njg5NjcsImV4cCI6MjA5MzE0NDk2N30.A8_1WWAEFdQAs3D6UgH7kVS--wmKN8m8dRVv7Bb_Nrg"
)
export default supabase

