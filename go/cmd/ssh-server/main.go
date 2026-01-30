package main

import (
	"fmt"
	"os"
	"website/internal/tui"

	"github.com/charmbracelet/bubbletea"
)

func main() {
	p := tea.NewProgram(tui.InitModel(), tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Alas, there's been an error: %v", err)
		os.Exit(1)
	}
}
