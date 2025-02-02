const std = @import("std");

pub fn day1Part1(inputLines: [][]const u8) i32 {
    // std.debug.print("{s}\n", .{inputLines[0]});
    const gpa = std.heap.page_allocator;
    // defer gpa.deinit();
    parseInput(gpa, inputLines) catch |err| {
        std.debug.print("Error: {}\n", .{err});
    };
    return -1;
}

fn parseInput(allocator: std.mem.Allocator, input_lines: [][]const u8) !void {
    for (input_lines) |input_line| {
        var digit_stack = std.ArrayList(u8).init(allocator);
        defer digit_stack.deinit();

        for (input_line) |char| {
            if (isDigit(char)) {
                std.debug.print("{d},", .{char});
                try digit_stack.append(char);
            } else {
                std.debug.print(" ", .{});
                for (digit_stack.items) |digit| {
                    std.debug.print("{c} ", .{digit});
                }
            }
        }
        std.debug.print("\n", .{});
        for (digit_stack.items) |digit| {
            std.debug.print("{c} ", .{digit});
        }
        std.debug.print("\n", .{});
    }
}

fn isDigit(char: u8) bool {
    return char >= 48 and char <= 57;
}
