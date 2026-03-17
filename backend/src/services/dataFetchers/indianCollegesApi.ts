import axios from 'axios';

export interface IndianCollegeData {
  name: string;
  state: string;
  city: string;
  type: string;
  courses: string[];
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi',
];

async function fetchCollegesByState(state: string): Promise<IndianCollegeData[]> {
  try {
    const encodedState = encodeURIComponent(state);
    const response = await axios.get(
      `https://colleges-api.onrender.com/colleges/state/${encodedState}`,
      { timeout: 10000 }
    );

    if (!Array.isArray(response.data)) return [];

    return response.data.map((college: any) => ({
      name: college.name || college.college_name || '',
      state: state,
      city: college.city || college.district || '',
      type: college.type || 'college',
      courses: college.courses || [],
    })).filter((c: IndianCollegeData) => c.name);
  } catch {
    // This API is unreliable — silently skip failing states
    return [];
  }
}

export async function fetchIndianColleges(): Promise<IndianCollegeData[]> {
  const allColleges: IndianCollegeData[] = [];
  console.log('[IndianCollegesAPI] Fetching colleges by state...');

  // Fetch a few states at a time to not overwhelm the API
  const batchSize = 3;
  for (let i = 0; i < INDIAN_STATES.length; i += batchSize) {
    const batch = INDIAN_STATES.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map((state) => fetchCollegesByState(state))
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allColleges.push(...result.value);
      }
    }

    // Small delay between batches
    if (i + batchSize < INDIAN_STATES.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`[IndianCollegesAPI] Fetched ${allColleges.length} colleges`);
  return allColleges;
}
