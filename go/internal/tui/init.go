package tui

import tea "github.com/charmbracelet/bubbletea"

type mainModel struct {
	current tea.Model   // The page currently being rendered
	history []tea.Model // The stack of previous pages
}

type navigateToMsg struct {
	next tea.Model
}

func InitModel() mainModel {
	return mainModel{
		current: homeModel{},
		history: []tea.Model{}, // Empty stack initially
	}
}

func (m mainModel) Init() tea.Cmd {
	return m.current.Init()
}

func (m mainModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {

	// Handle global keys like Back (Esc) and Quit
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c":
			return m, tea.Quit

		case "esc":
			// THE BACK LOGIC
			if len(m.history) > 0 {
				// 1. Pop the last model from history
				n := len(m.history) - 1
				previousModel := m.history[n]

				// 2. Remove it from the stack
				m.history = m.history[:n]

				// 3. Set it as current
				m.current = previousModel
				return m, nil
			} else {
				return m, tea.Quit
			}
		}

	// Handle navigation messages triggered by children
	case navigateToMsg:
		// THE FORWARD LOGIC
		// 1. Push current model to history
		m.history = append(m.history, m.current)

		// 2. Switch current to new model
		m.current = msg.next
		return m, m.current.Init()
	}

	// Forward all other messages to the current page
	var cmd tea.Cmd
	m.current, cmd = m.current.Update(msg)
	return m, cmd
}

func (m mainModel) View() string {
	return m.current.View()
}
