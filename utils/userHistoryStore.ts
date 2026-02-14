import { supabase } from './supabaseClient';

export interface ExamResultRow {
    id: string;
    user_id: string;
    exam_id: string;
    exam_title: string;
    wpm: number;
    accuracy: number;
    mistakes: number;
    backspaces: number;
    duration: number;
    mode: string;
    platform: string;
    created_at: string;
}

export const saveExamResultToSupabase = async (
    userId: string,
    result: Omit<ExamResultRow, 'id' | 'user_id' | 'created_at'>
) => {
    try {
        const { data, error } = await supabase
            .from('exam_results')
            .insert([{
                user_id: userId,
                ...result
            }]);

        if (error) {
            console.error('Error saving exam result to Supabase:', error);
            return false;
        }
        return true;
    } catch (e) {
        console.error('Exception saving exam result:', e);
        return false;
    }
};

export const getUserExamHistory = async (userId: string, days = 7) => {
    try {
        // Calculate date for filtering
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        const { data, error } = await supabase
            .from('exam_results')
            .select('*')
            .eq('user_id', userId)
            .gte('created_at', dateLimit.toISOString())
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching history:', error);
            return [];
        }
        return data as ExamResultRow[];
    } catch (e) {
        console.error('Exception fetching history:', e);
        return [];
    }
};
