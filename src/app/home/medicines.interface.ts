interface Time {
    beforeMeal: boolean;
    time: string;
}

export interface Medicine {
    id: string;
    name: string;
    isChecked: boolean;
    time: Time[];
    notes?: string;

}


