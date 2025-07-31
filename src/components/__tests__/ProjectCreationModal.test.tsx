import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProjectProvider } from "../../context/projectContext";
import ProjectCreationModal from "../ProjectCreationModal";

const createProject = jest.fn().mockResolvedValue({});
jest.mock("../../api/projects", () => ({
	createProject: (data: FormData) => createProject(data),
	fetchProjects: jest.fn().mockResolvedValue([]), // Mock fetchProjects to return an empty array
}));

describe("ProjectCreationModal", () => {
	const onClose = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});
	const queryClient = new QueryClient();
	const makeRender = () => render(
		<MemoryRouter>
			<QueryClientProvider client={queryClient}>
				<ProjectProvider>
					<ProjectCreationModal onClose={onClose} />
				</ProjectProvider>
			</QueryClientProvider>
		</MemoryRouter>
	);

	it("renders modal and form fields", () => {
		makeRender();
		expect(screen.getByText(/Create Project/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Project Name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Page URL/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Optional Project Description/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
	});

	it("calls onClose when Cancel is clicked", () => {
		makeRender();
		fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
		expect(onClose).toHaveBeenCalled();
	});

	it("updates form fields on user input", () => {
		makeRender();
		fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: "Test Project" } });
		fireEvent.change(screen.getByLabelText(/Page URL/i), { target: { value: "https://example.com" } });
		fireEvent.change(screen.getByLabelText(/Optional Project Description/i), { target: { value: "A description" } });
		expect(screen.getByLabelText(/Project Name/i)).toHaveValue("Test Project");
	});
	it("submits the form and calls onClose", async () => {
		makeRender();
		const name = "test project";
		const url = "https://example.com";
		const description = "A description";
		fireEvent.change(screen.getByLabelText(/Project Name/i), { target: { value: name } });
		fireEvent.change(screen.getByLabelText(/Page URL/i), { target: { value: url } });
		fireEvent.change(screen.getByLabelText(/Optional Project Description/i), { target: { value: description } });
		fireEvent.submit(screen.getByTestId("project-creation-form"));
		await waitFor(() => expect(onClose).toHaveBeenCalled());
		// Ensure createProject was called with the correct data
		const formDataArg = createProject.mock.calls[0][0];
		expect(formDataArg.get('name')).toBe(name);
		expect(formDataArg.get('description')).toBe(description);
		expect(formDataArg.get('pageUrl')).toBe(url);
	});
});