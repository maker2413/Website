package tui

import tea "github.com/charmbracelet/bubbletea"

type homeModel struct{}

func (m homeModel) Init() tea.Cmd { return nil }

func (m homeModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
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

func (m homeModel) View() string {
	return "🏠 Home Page" +
		"\nPress [A] to go to About." +
		"\nPress [C] to go to Contact." +
		"\nPress [H] to go to Home." +
		"\nPress [Esc] to go back." +
		"\nPress [Ctrl+C] to quit."
}
