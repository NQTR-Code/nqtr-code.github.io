document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('massSpectrum').getContext('2d');

    let chart; // Variável para armazenar o gráfico

    // Função para criar o gráfico
    function createChart(massas, intensidades) {
        if (chart) {
            chart.destroy(); // Remove o gráfico existente
        }

        // Cria um conjunto de todas as massas para garantir que o eixo X seja contínuo
        const allMasses = Array.from(new Set(massas));
        const minMass = Math.min(...allMasses);
        const maxMass = Math.max(...allMasses);
        const stepSize = 1; // Define o intervalo dos rótulos do eixo X

        // Cria um objeto para armazenar intensidades com base na massa
        const intensityMap = {};
        massas.forEach((mass, index) => {
            intensityMap[mass] = intensidades[index];
        });

        // Preenche a lista de dados com intensidades zero para massas não informadas
        const extendedMasses = [];
        const extendedIntensities = [];
        for (let i = minMass; i <= maxMass; i += stepSize) {
            extendedMasses.push(i);
            extendedIntensities.push(intensityMap[i] || 0);
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: extendedMasses,
                datasets: [{
                    label: 'Intensidade',
                    data: extendedIntensities,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Preto com 50% de opacidade
                    borderColor: 'rgba(0, 0, 0, 0.8)', // Preto com 80% de opacidade
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Massa (m/z)'
                        },
                        ticks: {
                            stepSize: stepSize
                        },
                        min: minMass,
                        max: maxMass
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Intensidade'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Função para processar a entrada do usuário
    function processInput() {
        const input = document.getElementById('dataInput').value.trim();
        const lines = input.split('\n');
        const massas = [];
        const intensidades = [];

        lines.forEach(line => {
            const parts = line.split('\t').map(part => part.trim());
            if (parts.length === 2) {
                const mass = parseFloat(parts[0]);
                const intensity = parseFloat(parts[1]);
                if (!isNaN(mass) && !isNaN(intensity)) {
                    massas.push(mass);
                    intensidades.push(intensity);
                }
            }
        });

        if (massas.length > 0) {
            createChart(massas, intensidades);
        } else {
            alert('Por favor, insira dados válidos.');
        }
    }

    // Função para baixar o gráfico como uma imagem
    function downloadImage() {
        if (chart) {
            const link = document.createElement('a');
            link.href = chart.toBase64Image(); // Obtém a URL da imagem
            link.download = 'espectro_de_massas.png'; // Nome do arquivo
            link.click(); // Simula o clique no link para baixar a imagem
        } else {
            alert('Por favor, crie um gráfico antes de baixar.');
        }
    }

    // Configura o botão para atualizar o gráfico
    document.getElementById('updateChart').addEventListener('click', processInput);

    // Configura o botão para baixar a imagem
    document.getElementById('downloadImage').addEventListener('click', downloadImage);
});
