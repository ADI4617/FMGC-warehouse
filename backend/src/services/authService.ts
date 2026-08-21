import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { v4 as uuid } from 'uuid';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/userRepository.js';
import { tenantRepository } from '../repositories/tenantRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

function sanitizeUser(user: any) {
  const { password_hash, ...safe } = user;
  return safe;
}

export const authService = {
  async signup(data: {
    fullName: string;
    businessName: string;
    email: string;
    phone?: string;
    password: string;
    plan?: string;
  }) {
    const existing = userRepository.findByEmail(data.email);
    if (existing) throw AppError.conflict('Email already registered');

    const tenantId = uuid();
    const userId = uuid();
    const passwordHash = await bcrypt.hash(data.password, 12);
    const now = new Date().toISOString();

    tenantRepository.create({
      id: tenantId,
      name: data.businessName,
      legal_entity: null,
      gstin: null,
      email: data.email,
      phone: data.phone ?? null,
      address: null,
      city: null,
      state: null,
      currency: 'USD',
      plan: data.plan ?? 'Enterprise',
      status: 'active',
      created_date: now,
      total_skus_count: 0,
      monthly_revenue_estimate: 0,
    });

    userRepository.create({
      id: userId,
      tenant_id: tenantId,
      name: data.fullName,
      email: data.email,
      password_hash: passwordHash,
      phone: data.phone ?? null,
      role: 'Owner',
      department: null,
      avatar: null,
      status: 'active',
      last_active: now,
      date_joined: now,
      permissions: JSON.stringify(['Full Access']),
      access_modules: JSON.stringify(['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Suppliers', 'Collections', 'Reports', 'AI Center', 'Staff & Roles', 'Audit Logs', 'Settings']),
    });

    const jwtOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as StringValue };
    const token = jwt.sign(
      { userId, tenantId, role: 'Owner', email: data.email },
      env.JWT_SECRET,
      jwtOptions
    );

    const user = userRepository.findById(userId);
    return { token, user: sanitizeUser(user) };
  },

  async login(email: string, password: string) {
    const user = userRepository.findByEmail(email);
    if (!user) throw AppError.unauthorized('Invalid email or password');

    if (['suspended', 'deactivated'].includes(user.status)) {
      throw AppError.unauthorized('Account is not active. Contact your administrator.');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw AppError.unauthorized('Invalid email or password');

    const tenant = tenantRepository.findById(user.tenant_id);
    if (!tenant || tenant.status !== 'active') {
      throw AppError.unauthorized('Tenant account is inactive');
    }

    // Update last active
    userRepository.update(user.id, user.tenant_id, {
      last_active: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: user.status === 'pending' ? 'active' : user.status,
    });

    const jwtOptions2: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as StringValue };
    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.role, email: user.email },
      env.JWT_SECRET,
      jwtOptions2
    );

    auditService.log({
      tenantId: user.tenant_id,
      actor: user.name,
      actorRole: user.role,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user.id,
      newValue: { email: user.email },
    });

    return { token, user: sanitizeUser(user), tenant };
  },

  async forgotPassword(email: string) {
    const user = userRepository.findByEmail(email);
    // Always return success to prevent email enumeration
    if (!user) return { message: 'If that email exists, a reset link has been sent.' };
    // Placeholder — no real email service
    return { message: 'If that email exists, a reset link has been sent.' };
  },

  getProfile(userId: string) {
    const user = userRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');
    const tenant = tenantRepository.findById(user.tenant_id);
    return { user: sanitizeUser(user), tenant };
  },
};
