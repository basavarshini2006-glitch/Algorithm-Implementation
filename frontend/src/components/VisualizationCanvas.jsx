import React, { useEffect, useRef } from 'react';

const getBarColor = (index, state) => {
  if (state?.sorted_indices?.includes(index)) return '#10b981'; // Emerald
  if (state?.swapped_indices?.includes(index)) return '#f59e0b'; // Amber
  if (state?.compared_indices?.includes(index)) return '#f43f5e'; // Rose
  return '#3b82f6'; // Blue
};

const normalizeArray = (arr, maxValue = 100) => {
  if (arr.length === 0) return [];
  const max = Math.max(...arr);
  return arr.map((val) => (val / max) * maxValue);
};

export const VisualizationCanvas = ({ state, type = 'sorting', graphData }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !state) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Set canvas size to match container
    if (container) {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width || 800;
      canvas.height = rect.height || 400;
    } else {
      canvas.width = 800;
      canvas.height = 400;
    }

    const ctx = canvas.getContext('2d');

    // Clear with dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0b10');
    gradient.addColorStop(1, '#11131a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if ((type === 'sorting' || type === 'searching') && state.array) {
      drawSortingVisualization(ctx, state, canvas);
    } else if (type === 'graph' && graphData) {
      drawGraphVisualization(ctx, state, canvas, graphData);
    }
  }, [state, type, graphData]);

  const drawSortingVisualization = (ctx, state, canvas) => {
    const arr = state.array;
    if (!arr || arr.length === 0) return;

    const normalized = normalizeArray(arr, canvas.height * 0.75);
    const barWidth = canvas.width / arr.length;
    const padding = 8;
    const barSpacing = Math.max(2, Math.floor(canvas.width / arr.length * 0.1));

    normalized.forEach((height, index) => {
      const x = index * barWidth + padding + (barSpacing / 2);
      const actualWidth = barWidth - padding - barSpacing;
      const y = canvas.height - height - padding;
      const color = getBarColor(index, state);

      // Draw shadow for depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(x, y + 3, actualWidth, height);

      // Draw bar with gradient
      const barGradient = ctx.createLinearGradient(x, y, x, y + height);
      barGradient.addColorStop(0, adjustBrightness(color, 1.2));
      barGradient.addColorStop(1, color);
      ctx.fillStyle = barGradient;
      ctx.fillRect(x, y, actualWidth, height);

      // Draw border with glow effect
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, actualWidth, height);

      // Add glow effect for active bars
      if (
        state?.sorted_indices?.includes(index) ||
        state?.swapped_indices?.includes(index) ||
        state?.compared_indices?.includes(index)
      ) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, actualWidth, height);
        ctx.shadowBlur = 0;
      }

      // Draw value text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      if (height > 30 && actualWidth > 15) {
        ctx.fillText(arr[index], x + actualWidth / 2, y + 5);
      }
    });

    // Draw title and stats
    ctx.fillStyle = '#9ca3af'; // text-gray-400
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Step: ${state.step || 0}`, 15, 20);
    ctx.fillStyle = '#e5e7eb'; // text-gray-200
    ctx.fillText(`Action: ${(state.action || 'Sorting').toUpperCase()}`, 15, 40);
  };

  const drawGraphVisualization = (ctx, state, canvas, graphData) => {
    const { nodes, edges } = graphData;
    if (!nodes || nodes.length === 0) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3;
    const nodeRadius = 20;

    // Calculate node positions in circle
    const nodePositions = {};
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI - Math.PI / 2;
      nodePositions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    // Draw edges
    edges.forEach(([src, dst, weight]) => {
      const pos1 = nodePositions[src];
      const pos2 = nodePositions[dst];
      if (!pos1 || !pos2) return;

      ctx.strokeStyle = '#374151'; // gray-700
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pos1.x, pos1.y);
      ctx.lineTo(pos2.x, pos2.y);
      ctx.stroke();

      // Draw weight if available
      if (weight !== undefined) {
        const midX = (pos1.x + pos2.x) / 2;
        const midY = (pos1.y + pos2.y) / 2;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(weight.toString(), midX, midY - 5);
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      const pos = nodePositions[node];
      if (!pos) return;

      let color = '#6b7280'; // gray-500
      if (state?.current_node === node) color = '#f59e0b'; // amber
      else if (state?.visited_nodes?.includes(node)) color = '#10b981'; // emerald
      else if (state?.next_node === node) color = '#3b82f6'; // blue

      // Draw node circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node, pos.x, pos.y);
    });

    // Draw title and stats
    ctx.fillStyle = '#9ca3af';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Step: ${state.step || 0}`, 15, 20);
    ctx.fillStyle = '#e5e7eb';
    ctx.fillText(`Action: ${(state.action || 'Graph').toUpperCase()}`, 15, 40);
  };

  const adjustBrightness = (color, factor) => {
    let num = parseInt(color.replace('#', ''), 16);
    let amt = Math.round(2.55 * (factor - 1));
    let R = (num >> 16) + amt;
    let G = (num >> 8 & 0x00FF) + amt;
    let B = (num & 0x0000FF) + amt;
    return (
      '#' +
      (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255))
        .toString(16)
        .slice(1)
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
          display: 'block'
        }}
      />
    </div>
  );
};
