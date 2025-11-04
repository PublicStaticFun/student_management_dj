import { create } from "zustand"

const useStudentStore = create((set) => ({
    students: [],
    setStudents: (students) => set({ students }),
    addStudent: (student) => set((state) => ({ students: [...state.students, student]})),
    updateStudent: (updatedStudent) => set((state) => ({
        students: state.students.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    })),
    deleteStudent: (id) => set((state) => ({
        students: state.students.filter(s => s.id !== id)
    })),
}));

export default useStudentStore;