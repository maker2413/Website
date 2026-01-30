package tui

import tea "github.com/charmbracelet/bubbletea"

type aboutModel struct{}

func (m aboutModel) Init() tea.Cmd { return nil }

func (m aboutModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "a":
			return m, func() tea.Msg { return navigateToMsg{aboutModel{}} }
		case "c":
			return m, func() tea.Msg { return navigateToMsg{contactModel{}} }
		case "h":
			return m, func() tea.Msg { return navigateToMsg{homeModel{}} }
		}
	}

	return m, nil
}

func (m aboutModel) View() string {
	return "📄 About Page" +
		"\nPress [A] to go to About." +
		"\nPress [C] to go to Contact." +
		"\nPress [H] to go to Home." +
		"\nPress [Esc] to go back." +
		"\nPress [Ctrl+C] to quit."
}
